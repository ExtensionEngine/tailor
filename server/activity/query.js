const INSERT_ACTIVITY = `
LET defaultPosition = LENGTH(
  FOR act in @@collection
    FILTER act.courseKey == @activity.courseKey
    FILTER act.parentKey == @activity.parentKey
    RETURN act
)

INSERT {
  name: @activity.name,
  type: @activity.type,
  courseKey: @activity.courseKey,
  parentKey: @activity.parentKey,
  position: defaultPosition
} IN @@collection
RETURN NEW
`;

module.exports = {
  INSERT_ACTIVITY
};
