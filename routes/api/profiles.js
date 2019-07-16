const expres = require('express')
const router = expres.Router()
const passport = require('passport')
const Profile = require('../../models/Profile')

/**
 * @route GET /api/profiles
 * @desc 获取所有信息接口
 * @access Private
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.find().then(profile => {
    if (!profile) {
      return res.status(400).json('没有数据！')
    }
    res.status(200).json(profile)
  }).catch(err => res.status(404).json(err))
})

/**
 * @route GET /api/profiles
 * @desc 获取单个信息接口
 * @access Private
 */
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ _id: req.params.id }).then(profile => {
    if (!profile) {
      return res.status(400).json('没有数据！')
    }
    res.status(200).json(profile)
  }).catch(err => res.status(404).json(err))
})

/**
 * @route POST /api/profiles/add
 * @desc 创建信息接口
 * @access Private
 */
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const profileFilelds = {}
  if (req.body.type) profileFilelds.type = req.body.type
  if (req.body.describe) profileFilelds.describe = req.body.describe
  if (req.body.income) profileFilelds.income = req.body.income
  if (req.body.expend) profileFilelds.expend = req.body.expend
  if (req.body.cash) profileFilelds.cash = req.body.cash
  if (req.body.remark) profileFilelds.remark = req.body.remark

  new Profile(profileFilelds).save().then(profile => {
    res.status(200).json(profile)
  }).catch(err => res.status(404).json(err))
})

/**
 * @route POST /api/profiles/edit/:id
 * @desc 编辑信息接口
 * @access Private
 */
router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const profileFilelds = {}
  if (req.body.type) profileFilelds.type = req.body.type
  if (req.body.describe) profileFilelds.describe = req.body.describe
  if (req.body.income) profileFilelds.income = req.body.income
  if (req.body.expend) profileFilelds.expend = req.body.expend
  if (req.body.cash) profileFilelds.cash = req.body.cash
  if (req.body.remark) profileFilelds.remark = req.body.remark

  Profile.findByIdAndUpdate({ _id: req.params.id }, { $set: profileFilelds }, { new: true })
    .then(profile => {
      res.status(200).json(profile)
    }).catch(err => res.status(404).json(err))
})

/**
 * @route POST /api/profiles/delete/:id
 * @desc 删除信息接口
 * @access Private
 */
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findByIdAndRemove({ _id: req.params.id })
    .then(profile => {
      profile.save().then(profile => res.status(200).json(profile))
    }).catch(err => res.status(404).json('删除失败！'))
})

module.exports = router