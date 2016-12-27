import TypedError from 'error/typed';

const LevelUnsupportedError = TypedError({
  message: '{name} - не поддерживаемый уровень логирования (level={level})',
  type   : `micro.modules.health-check.level.unsupported`,
  code   : 500,
  level  : null
});

export default request => {
  const { level } = request;
  if (!Object.keys(request.log.LEVELS).includes(level)) {
    return Promise.resolve(LevelUnsupportedError({ level }));
  }

  return Promise.resolve(request.log.level = level);
};