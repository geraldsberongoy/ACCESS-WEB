-- Atomic helper for officer creation to avoid display_order races.
CREATE OR REPLACE FUNCTION public.create_officer_atomic(
  p_id uuid,
  p_full_name text,
  p_email text,
  p_position_title text,
  p_department text,
  p_academic_year text,
  p_image_url text,
  p_is_active boolean,
  p_display_order integer DEFAULT NULL
)
RETURNS public."Officers"
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_row public."Officers";
  v_next_display_order integer;
BEGIN
  IF p_display_order IS NULL THEN
    LOCK TABLE public."Officers" IN SHARE ROW EXCLUSIVE MODE;

    SELECT COALESCE(MAX(o.display_order), -1) + 1
      INTO v_next_display_order
      FROM public."Officers" o;
  ELSE
    v_next_display_order := p_display_order;
  END IF;

  INSERT INTO public."Officers" (
    id,
    full_name,
    email,
    position_title,
    department,
    academic_year,
    image_url,
    is_active,
    display_order
  )
  VALUES (
    p_id,
    p_full_name,
    p_email,
    p_position_title,
    p_department,
    p_academic_year,
    p_image_url,
    p_is_active,
    v_next_display_order
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

-- Atomic reorder using a single statement, so all updates succeed or fail together.
CREATE OR REPLACE FUNCTION public.reorder_officers_atomic(
  p_officers jsonb
)
RETURNS SETOF public."Officers"
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_payload_count integer;
  v_updated_count integer;
BEGIN
  SELECT COUNT(*)
    INTO v_payload_count
    FROM jsonb_array_elements(p_officers) AS item;

  RETURN QUERY
  WITH payload AS (
    SELECT
      (item ->> 'id')::uuid AS id,
      (item ->> 'display_order')::integer AS display_order
    FROM jsonb_array_elements(p_officers) AS item
  ),
  updated AS (
    UPDATE public."Officers" o
    SET display_order = p.display_order
    FROM payload p
    WHERE o.id = p.id
    RETURNING o.*
  )
  SELECT *
  FROM updated
  ORDER BY display_order ASC;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  IF v_payload_count <> v_updated_count THEN
    RAISE EXCEPTION 'One or more officers were not found during reorder'
      USING ERRCODE = 'P0002';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_officer_atomic(uuid, text, text, text, text, text, text, boolean, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reorder_officers_atomic(jsonb) TO authenticated;
