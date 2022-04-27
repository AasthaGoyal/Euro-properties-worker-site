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

const DefaultHeader = () => {
	const deviceScreen = useDeviceScreen();
	return (
		<Header>
       <SubHeader>
        <SubHeaderLeft>
          <span className='h4 mb-0 fw-bold'>Dashboard</span>
          <SubheaderSeparator />

        </SubHeaderLeft>
        <SubHeaderRight>
          Summary of all services
        </SubHeaderRight>
      </SubHeader>
		
		</Header>
	);
};

export default DefaultHeader;
