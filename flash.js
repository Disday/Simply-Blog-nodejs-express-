export default () => (req, res, next) => {
  res.flash = (type, message) => {
    const { flash = [] } = req.session;
    req.session.flash = [...flash, { type, message }];
  };

  res.locals.flash = req.session?.flash ?? [];
  req.session.flash = [];
  next();
};
