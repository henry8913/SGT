import ast
import operator
from typing import Any

from app.engine.dll_replacement import BUILTIN_FUNCTIONS

ALLOWED_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Pow: operator.pow,
    ast.Mod: operator.mod,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
    ast.Gt: operator.gt,
    ast.Lt: operator.lt,
    ast.GtE: operator.ge,
    ast.LtE: operator.le,
    ast.Eq: operator.eq,
    ast.NotEq: operator.ne,
}

ALLOWED_CONSTANTS = {
    "pi": 3.141592653589793,
    "e": 2.718281828459045,
}


class FormulaError(Exception):
    pass


def eval_formula(formula_text: str, context: dict[str, float]) -> float:
    """Evaluate a formula string safely using AST parsing.

    Supports:
    - Basic arithmetic: +, -, *, /, //, **, %
    - Comparisons: >, <, >=, <=, ==, !=
    - Built-in functions: PW_NORMA, MW_TORRE, MW_OUT_TORRE, TW_TORRE, TW_OUT_TORRE
    - Constants: pi, e
    - Field references from context
    - Numbers (int, float)

    Args:
        formula_text: The formula string (e.g. "Masse_proprie.Q52 * Macchina.S14")
        context: Dict of available field values

    Returns:
        Computed float result

    Raises:
        FormulaError: If formula is invalid or unsafe
    """
    tree = ast.parse(formula_text.strip(), mode="eval")
    return _eval_node(tree.body, context)


def _eval_node(node: ast.AST, context: dict[str, float]) -> float:
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return float(node.value)
        raise FormulaError(f"Unsupported constant: {node.value}")

    if isinstance(node, ast.Name):
        name = node.id
        if name in ALLOWED_CONSTANTS:
            return ALLOWED_CONSTANTS[name]
        if name in context:
            return float(context[name])
        raise FormulaError(f"Unknown reference: {name}")

    if isinstance(node, ast.Attribute):
        full_name = _get_full_name(node)
        if full_name in context:
            return float(context[full_name])
        raise FormulaError(f"Unknown reference: {full_name}")

    if isinstance(node, ast.UnaryOp):
        op = ALLOWED_OPERATORS.get(type(node.op))
        if op is None:
            raise FormulaError(f"Unsupported unary operator: {type(node.op).__name__}")
        operand = _eval_node(node.operand, context)
        return float(op(operand))

    if isinstance(node, ast.BinOp):
        op = ALLOWED_OPERATORS.get(type(node.op))
        if op is None:
            raise FormulaError(f"Unsupported binary operator: {type(node.op).__name__}")
        left = _eval_node(node.left, context)
        right = _eval_node(node.right, context)
        return float(op(left, right))

    if isinstance(node, ast.Compare):
        left = _eval_node(node.left, context)
        if len(node.ops) != 1 or len(node.comparators) != 1:
            raise FormulaError("Chained comparisons not supported")
        op = ALLOWED_OPERATORS.get(type(node.ops[0]))
        if op is None:
            raise FormulaError(f"Unsupported comparison: {type(node.ops[0]).__name__}")
        right = _eval_node(node.comparators[0], context)
        return float(op(left, right))

    if isinstance(node, ast.Call):
        func_name = _get_call_func_name(node.func)
        if func_name in BUILTIN_FUNCTIONS:
            args = [_eval_node(arg, context) for arg in node.args]
            return float(BUILTIN_FUNCTIONS[func_name](*args))
        raise FormulaError(f"Unknown function: {func_name}")

    raise FormulaError(f"Unsupported expression: {type(node).__name__}")


def _get_full_name(node: ast.Attribute) -> str:
    parts = []
    current = node
    while isinstance(current, ast.Attribute):
        parts.append(current.attr)
        current = current.value
    if isinstance(current, ast.Name):
        parts.append(current.id)
    return ".".join(reversed(parts))


def _get_call_func_name(node: ast.AST) -> str:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        return _get_full_name(node)
    raise FormulaError(f"Unsupported function expression: {type(node).__name__}")


def build_context(project_id: int, db) -> dict[str, float]:
    """Build a flat context dict from all project input tables."""
    context = {}

    from app.models.machine import MachineCharacteristics
    from app.models.stability import StabilityParam
    from app.models.masses import Mass
    from app.models.load_curves import LoadCurve
    from app.models.wind_areas import WindArea
    from app.models.geometry import BeamGeometry

    machine = db.query(MachineCharacteristics).filter(
        MachineCharacteristics.project_id == project_id
    ).first()
    if machine:
        for col in machine.__table__.columns:
            if col.name not in ("id", "project_id", "created_at"):
                val = getattr(machine, col.name)
                if val is not None:
                    context[f"Macchina.{col.name}"] = float(val)

    params = db.query(StabilityParam).filter(
        StabilityParam.project_id == project_id
    ).all()
    for p in params:
        if p.valore is not None:
            context[f"Stabilità.{p.parametro}"] = float(p.valore)
            context[p.parametro] = float(p.valore)

    masses = db.query(Mass).filter(
        Mass.project_id == project_id, Mass.utilizzato == True
    ).all()
    for idx, m in enumerate(masses):
        if m.massa_kg is not None:
            context[f"Masse_proprie.Q{idx+1}"] = float(m.massa_kg)
        if m.braccio_m is not None:
            context[f"Masse_proprie.T{idx+1}"] = float(m.braccio_m)

    curves = db.query(LoadCurve).filter(LoadCurve.project_id == project_id).all()
    for idx, c in enumerate(curves):
        if c.carico_kg is not None:
            context[f"Curve_di_carico.{c.tipo}.R{c.raggio_m}"] = float(c.carico_kg)

    areas = db.query(WindArea).filter(WindArea.project_id == project_id).all()
    for idx, a in enumerate(areas):
        if a.valore is not None:
            context[f"Aree_vento.{a.parte}.{a.parametro}"] = float(a.valore)
        if a.coordinata_x is not None:
            context[f"Aree_vento.{a.parte}.Xcs_{a.parametro}"] = float(a.coordinata_x)
        if a.coordinata_y is not None:
            context[f"Aree_vento.{a.parte}.Ycs_{a.parametro}"] = float(a.coordinata_y)

    return context
