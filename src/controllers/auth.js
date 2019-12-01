export const requireLogin = (req, res, next) => {
  next()
}

export const refreshToken = (req, res) => {
  res.json({ success: true })
}
