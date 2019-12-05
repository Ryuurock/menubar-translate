import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { remote, ipcRenderer, shell } from 'electron';
import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, TextInput } from 'react-desktop/macOs';

import styles from './styles.scss';
import { Input, Button } from '@/render/components';

export const TypeToken: React.FC = () => {
  const { search } = useLocation();
  const searchParsed = qs.parse(search);
  const [state, setState] = useState<IUserConfig>(searchParsed.appId && searchParsed.token ? searchParsed : { appId: '', token: '' });

  const handleChange = useCallback((type: string) => (e: any) => {
    setState({
      ...state,
      [type]: e.target.value.trim(),
    });
  }, [state]);

  const handleClose = useCallback(() => {
    remote.getCurrentWindow().close();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ipcRenderer.send('submit-type-token', state);
  }, [state]);

  useEffect(() => {
    ipcRenderer.send('react-did-mounted');
  });

  return (
    <div className={styles.typeToken}>
      <div className={styles.icon}>
        <img
          src={require('@/../resources/icon.png').default}
          width="52"
          height="52"
        />
      </div>
      <div className={styles.content}>
        <p className={styles.title}>输入信息以继续</p>
        <p className={styles.extraInfo}>该应用使用了百度翻译开放平台，请填入以下内容确保正常使用。</p>
        <div className={styles.body}>
          <form onSubmit={handleSubmit} id="type-token">
            <div className={styles.formItem}>
              <div className={styles.formItemLable}>APP ID：</div>
              <div>
                <Input
                  value={state.appId}
                  placeholder="必填"
                  onChange={handleChange('appId')}
                  width="208"
                />
              </div>
            </div>
            <div className={styles.formItem}>
              <div className={styles.formItemLable}>密钥：</div>
              <div>
                <Input
                  value={state.token}
                  placeholder="必填"
                  onChange={handleChange('token')}
                  width="208"
                />
              </div>
            </div>
            <p style={{ marginTop: 20 }}>
              <a href="javascript: void(0)" onClick={() => shell.openExternal('http://api.fanyi.baidu.com/api/trans/product/prodinfo')}>
                去获取以上信息
              </a>
            </p>
          </form>
        </div>
        <div className={styles.footer}>
          <Button>取消</Button>
          <Button isPrimary>确定</Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog
      icon={
        <img
          src={require('@/../resources/icon.png').default}
          width="52"
          height="52"
        />
      }
      title="输入信息以继续"
      message={(
        <form onSubmit={handleSubmit} id="type-token">
          <div style={{ fontSize: 10, marginBottom: 12 }}>该应用使用了百度翻译开放平台，请填入以下内容确保正常使用。</div>
          <div className={styles.formItem}>
            <div className={styles.formItemLable}>APP ID：</div>
            <div>
              <Input
                value={state.appId}
                placeholder="必填"
                onChange={handleChange('appId')}
                width="208"
              />
            </div>
          </div>
          <div className={styles.formItem}>
            <div className={styles.formItemLable}>密钥：</div>
            <div>
              <Input
                value={state.token}
                placeholder="必填"
                onChange={handleChange('token')}
                width="208"
              />
            </div>
          </div>
          <p style={{ marginTop: 20 }}>
            <a href="javascript: void(0)" onClick={() => shell.openExternal('http://api.fanyi.baidu.com/api/trans/product/prodinfo')}>
              去获取以上信息
            </a>
          </p>
        </form>
      )}
      buttons={[
        <Button onClick={handleClose}>取消</Button>,
        <Button
          form="type-token"
          color="blue"
          type="submit"
          disabled={!(state.appId && state.token)}
        >提交</Button>,
      ]}
    />
  );
};
