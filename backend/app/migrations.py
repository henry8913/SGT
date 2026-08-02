"""Migrazioni manuali per SQLite (il progetto non usa Alembic)."""

from sqlalchemy import inspect, text


def run_migrations(engine):
    _migrate_beam_profiles(engine)
    _drop_formulas_table(engine)


def _migrate_beam_profiles(engine):
    try:
        inspector = inspect(engine)
        profile_columns = [c['name'] for c in inspector.get_columns('beam_profiles')]
        with engine.connect() as conn:
            if 'hy_mm3' in profile_columns and 'hy_mm' not in profile_columns:
                conn.execute(text("ALTER TABLE beam_profiles RENAME COLUMN hy_mm3 TO hy_mm"))
                print("[Migration] Renamed beam_profiles.hy_mm3 -> hy_mm")
            if 'bz_mm3' in profile_columns and 'bz_mm' not in profile_columns:
                conn.execute(text("ALTER TABLE beam_profiles RENAME COLUMN bz_mm3 TO bz_mm"))
                print("[Migration] Renamed beam_profiles.bz_mm3 -> bz_mm")
            if 'riferimento' not in profile_columns:
                conn.execute(text("ALTER TABLE beam_profiles ADD COLUMN riferimento INTEGER"))
                print("[Migration] Added riferimento column to beam_profiles")
            if 'peso_kg_m' not in profile_columns:
                conn.execute(text("ALTER TABLE beam_profiles ADD COLUMN peso_kg_m FLOAT"))
                print("[Migration] Added peso_kg_m column to beam_profiles")
            conn.commit()
    except Exception as e:
        print(f"[Migration] Note: {e}")


def _drop_formulas_table(engine):
    """La tabella `formulas` (celle importate dall'Excel) non esiste più:
    il motore usa i moduli Python e i coefficienti."""
    try:
        inspector = inspect(engine)
        if 'formulas' not in inspector.get_table_names():
            return
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS formulas"))
            conn.commit()
            print("[Migration] Dropped formulas table")
    except Exception as e:
        print(f"[Migration] Note: {e}")
