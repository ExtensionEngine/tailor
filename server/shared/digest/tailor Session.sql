WITH content_revision AS (
  WITH element_activity AS (
    SELECT
      content_element.id as content_id,
      content_element.repository_id,
      activity_id,
      content_element.type as content_type,
      content_element.created_at as content_element_created_at,
      content_element.data as content_data,
      activity.data as activity_data,
      activity.parent_id as parent_activity_id,
      activity.type as activity_type
    FROM public.content_element
    INNER JOIN public.activity on activity.id = content_element.activity_id
  )
  SELECT
    repository.id as repository_id,
    repository.name as repository_name,
    repository_user.created_at as repository_user_added,
    parent_activity_id,
    element_activity.activity_id,
    element_activity.activity_type,
    element_activity.content_id,
    element_activity.content_type,
    content_data,
    activity_data,
    repository.data as repository_data,
    repository.created_at as repository_created_at,
    repository_user.user_id as repository_user_id
  FROM element_activity
  INNER JOIN public.repository on element_activity.repository_id = repository.id
  INNER JOIN repository_user on repository_user.repository_id = element_activity.repository_id

)
SELECT
  public.user.email as email,
  content_revision.repository_name,
  content_revision.repository_data,
  content_revision.repository_created_at,
  content_revision.repository_user_added,
  content_revision.parent_activity_id,
  content_revision.activity_id,
  content_revision.activity_type,
  content_revision.activity_data,
  content_revision.content_id,
  content_revision.content_type,
  content_revision.content_data,
  revision.operation
FROM content_revision
INNER JOIN public.revision on content_revision.repository_id = revision.repository_id
INNER JOIN public.user on content_revision.repository_user_id = public.user.id
ORDER BY
    repository_name,
    parent_activity_id;
