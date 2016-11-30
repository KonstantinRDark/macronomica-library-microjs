
export default (micro, plugins) => {
  Object.keys(plugins)
        .forEach(name => micro.plugin(name, plugins[ name ]));
};