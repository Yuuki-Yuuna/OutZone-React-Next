import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { createStyles } from 'antd-style'
import { LoadingOutlined } from '@ant-design/icons'
import { Form, Spin, Input, Button, App } from 'antd'
import ThemeSwitch from '~/components/universal/ThemeSwitch/ThemeSwitch'
import { userApi } from '~/api'
import { setToken } from '~/util'
import { LoginInfo } from '~/type'

const LoginForm: React.FC = () => {
  const { styles } = useStyles()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { loading, run: userLogin } = useRequest(userApi.userLogin, {
    manual: true,
    onSuccess(data) {
      setToken(data.token)
      message.success('登陆成功~')
      navigate('/')
    },
    onError(err) {
      message.error(err.message)
    }
  })

  const login = async (info: LoginInfo) => {
    // console.log(info)
    userLogin(info)
  }

  return (
    <Spin
      spinning={loading}
      indicator={<LoadingOutlined />}
      size='large'
      wrapperClassName={styles.wrapper}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>
        <Form
          name='登录'
          onFinish={login}
          autoComplete='off'
          validateTrigger={'onBlur'}
        >
          <Form.Item
            label='账号'
            name='username'
            required={false}
            rules={[
              {
                required: true,
                type: 'string',
                min: 4,
                max: 16,
                message: '账号应在4-16位间'
              }
            ]}
          >
            <Input className={styles.input} maxLength={16} />
          </Form.Item>
          <Form.Item
            label='密码'
            name='password'
            required={false}
            rules={[
              {
                required: true,
                type: 'string',
                min: 6,
                max: 20,
                message: '密码应在6-20位间'
              }
            ]}
          >
            <Input.Password className={styles.input} maxLength={20} />
          </Form.Item>
          <Form.Item className={styles.submit}>
            <Button type='primary' htmlType='submit' shape='round'>
              登录
            </Button>
          </Form.Item>
        </Form>
        <ThemeSwitch className={styles.switch} />
      </div>
    </Spin>
  )
}

export default LoginForm

const useStyles = createStyles(({ token, css }) => {
  return {
    wrapper: css`
      background-color: ${token.colorBgContainer};
    `,
    container: css`
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 300px;
      height: 380px;
      flex-shrink: 0;
      background-color: ${token.colorBgContainer};
      transition: 0.2s all;
    `,
    title: css`
      font-style: italic;
      color: ${token.colorTextHeading};
      margin-bottom: 24px;
    `,
    input: css`
      border: none;
      border-radius: 0;
      box-shadow: none !important;
      border-bottom: 2px solid ${token.colorBorder};
    `,
    submit: css`
      text-align: center;
      padding-top: 12px;
    `,
    switch: css`
      position: absolute;
      top: 8px;
      right: 8px;
    `
  }
})
