const expres = require('express')
const router = expres.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const passport = require('passport')
const User = require('../../models/User')
const { secretOrKey } = require('../../config/keys')

/**
 * @route POST /api/users/register
 * @desc 返回请求注册数据
 * @access Public
 */
router.post('/register', (req, res) => {
  const { name, email, identity, password } = req.body
    // 查询数据库是否拥有邮箱
  User.findOne({ email: email }).then(user => {
    if (user) {
      return res.status(400).json('邮箱已被注册！')
    } else {
      // 头像
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })

      const newUser = new User({
        name,
        email,
        avatar,
        identity,
        password
      })

      // 密码加密 
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash

          newUser.save()
            .then(user => res.status(200).json(user))
            .catch(err => res.status(404).json(err))
        })
      })
    }
  })
})

/**
 * @route POST /api/users/login
 * @desc 返回请求登录数据
 * @access Public
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body
    // 查询数据库
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json('用户不存在！')
    }

    // 密码匹配
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const rule = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          identity: user.identity
        }
        jwt.sign(rule, secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err
          res.status(200).json({
            code: 0,
            token: 'Bearer ' + token
          })
        })
      } else {
        res.status(400).json('密码错误！')
      }
    })
  }).catch(err => res.status(404).json(err))
})

/**
 * @route POST /api/users/current
 * @desc 返回请求当前用户信息
 * @access Private
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id, name, email, avatar, identity, date } = req.user
  res.status(200).json({
    id,
    name,
    email,
    avatar,
    identity,
    date
  })
})

module.exports = router