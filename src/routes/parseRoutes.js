const parseRoutes = (routes, { middleware, path }) => {
  const retval = []
  for (const [route, defs] of Object.entries(routes)) {
    for (const [action, actionDefs] of Object.entries(defs)) {
      const carriedMiddlewares = middleware.concat(defs.middleware || [])
      if (action === 'routes') {
        const moreRoutes = parseRoutes(
          actionDefs, { middleware: carriedMiddlewares, path: path + route }
        )
        return retval.concat(moreRoutes)
      } else if (action !== 'middleware') {
        const routePath = path + route
        retval.push({
          method: action,
          path: routePath,
          middlewares: carriedMiddlewares.concat(actionDefs.middleware || []),
          controller: actionDefs
        })
      }
    }
  }
  return retval
}

export default parseRoutes
