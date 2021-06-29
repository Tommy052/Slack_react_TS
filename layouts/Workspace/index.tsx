import React, { FC, VFC, useCallback, useState } from 'react';
import { IUser } from '@typings/db';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import fetcher from '@utils/fetcher';
import Menu from '@components/Menu';
import useSWR from 'swr';
import axios from 'axios';
import loadable from '@loadable/component';
import { Redirect, Route, Switch, Link } from 'react-router-dom';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: userData, error, revalidate } = useSWR<IUser | false>('/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios
      .post(
        '/api/users/logout',
        null
        ,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        revalidate();
      });
  }, []);
  const onClickCreateWorkspace = useCallback(() => {

  }, [])
  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, [])
  if (!userData) {
    return <Redirect to="/login" />
  }
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>)}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            )
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <Workspaces>Sleact</Workspaces>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path='/workspace/channel' component={Channel} />
            <Route path='/workspace/dm' component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>

    </div>
  )
}
export default Workspace;