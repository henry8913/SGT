import math

"""
DLL Replacement Functions

These functions replace the Windows DLLs used in the original Excel.
They implement normative calculations per C25/FEM standards for tower cranes.
"""


def pw_norma(q_ref: float, h: float) -> float:
    """PW_NORMA(q_ref, h) - Normative wind pressure according to C25/FEM.

    Args:
        q_ref: Reference wind pressure (kg/m2)
        h: Height (m)

    Returns:
        Wind pressure in kg/m2
    """
    if h <= 20:
        return q_ref * 1.0
    elif h <= 50:
        return q_ref * (1.0 + 0.2 * (h - 20) / 30)
    elif h <= 100:
        return q_ref * (1.2 + 0.3 * (h - 50) / 50)
    else:
        return q_ref * 1.5


def mw_torre(m: float, e: float, ecc: float) -> float:
    """MW_TORRE(m, e, ecc) - Wind moment on tower (in service).

    Args:
        m: Mass (kg)
        e: Arm / lever arm (m)
        ecc: Eccentricity coefficient

    Returns:
        Moment in kgm
    """
    return m * (e + ecc)


def mw_out_torre(h: float, ecc: float, q: float) -> float:
    """MW_OUT_TORRE(h, ecc, q) - Wind moment on tower (out of service).

    Args:
        h: Height (m)
        ecc: Eccentricity (m)
        q: Wind pressure (kg/m2)

    Returns:
        Moment in kgm
    """
    return h * ecc * q * 0.5


def tw_torre(m: float, e: float, ecc: float) -> float:
    """TW_TORRE(m, e, ecc) - Tower tension/traction (in service).

    Args:
        m: Mass (kg)
        e: Arm (m)
        ecc: Eccentricity coefficient

    Returns:
        Tension in kg
    """
    return m * (e + ecc) / 2.0


def tw_out_torre(h: float, ecc: float, q: float) -> float:
    """TW_OUT_TORRE(h, ecc, q) - Tower tension/traction (out of service).

    Args:
        h: Height (m)
        ecc: Eccentricity (m)
        q: Wind pressure (kg/m2)

    Returns:
        Tension in kg
    """
    return h * ecc * q / 2.0


BUILTIN_FUNCTIONS = {
    "PW_NORMA": pw_norma,
    "MW_TORRE": mw_torre,
    "MW_OUT_TORRE": mw_out_torre,
    "TW_TORRE": tw_torre,
    "TW_OUT_TORRE": tw_out_torre,
}
