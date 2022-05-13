import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import Navigation from '../../../layout/Navigation/Navigation';
import { componentsMenu, layoutMenu } from '../../../menu';
import useDeviceScreen from '../../../hooks/useDeviceScreen';
import CommonHeaderRight from './CommonHeaderRight';
import Search from '../../../components/Search';
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import User from '../../../layout/User/User'

const DefaultHeader = () => {
  const deviceScreen = useDeviceScreen();
  return (
    <Header>
      <SubHeader>
        <SubHeaderLeft>
          

        </SubHeaderLeft>
        <SubHeaderRight>
          <CommonHeaderRight />
          <User />
        </SubHeaderRight>
      </SubHeader>

    </Header>
  );
};

export default DefaultHeader;
