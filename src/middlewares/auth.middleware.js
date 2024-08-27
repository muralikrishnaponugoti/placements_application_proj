export const auth = (req, res, next) => {
    if (req.session.adminEmail) {
      next();
    } else {
      res.redirect('/');
    }
  };