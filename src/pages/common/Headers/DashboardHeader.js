import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import Search from '../../../components/Search';
import CommonHeaderRight from './CommonHeaderRight';
import User from '../../../layout/User/User';
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';

const DashboardHeader = () => {
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

export default DashboardHeader;
