import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Brand from '../Brand/Brand';
import Navigation, { NavigationLine } from '../Navigation/Navigation';
import User from '../User/User';
import { componentsMenu, dashboardMenu, demoPages } from '../../menu';
import ThemeContext from '../../contexts/themeContext';
import Card, { CardBody } from '../../components/bootstrap/Card';

import Hand from '../../assets/img/hand.png';
import HandWebp from '../../assets/img/hand.webp';
import Icon from '../../components/icon/Icon';
import Button from '../../components/bootstrap/Button';
import Tooltips from '../../components/bootstrap/Tooltips';
import useDarkMode from '../../hooks/useDarkMode';
import useAsideTouch from '../../hooks/useAsideTouch';

const Aside = () => {
  const layoutMenu = {
    layoutTypes: {
      id: 'layoutTypes',
      text: 'Page Layout Types',
    },
    blank: {
      id: 'blank',
      text: 'Blank',
      path: 'page-layouts/blank',
      icon: 'check_box_outline_blank ',
    },
    pageLayout: {
      id: 'pageLayout',
      text: 'Page Layout',
      path: 'page-layouts',
      icon: 'BackupTable',
      subMenu: {
        headerAndSubheader: {
          id: 'headerAndSubheader',
          text: 'Header & Subheader',
          path: 'page-layouts/header-and-subheader',
          icon: 'ViewAgenda',
        },
        onlyHeader: {
          id: 'onlyHeader',
          text: 'Only Header',
          path: 'page-layouts/only-header',
          icon: 'ViewStream',
        },
        onlySubheader: {
          id: 'onlySubheader',
          text: 'Only Subheader',
          path: 'page-layouts/only-subheader',
          icon: 'ViewStream',
        },
        onlyContent: {
          id: 'onlyContent',
          text: 'Only Content',
          path: 'page-layouts/only-content',
          icon: 'WebAsset',
        },
      },
    },
    asideTypes: {
      id: 'asideTypes',
      text: 'Aside Types',
      path: 'aside-types',
      icon: 'Vertical Split',
      subMenu: {
        defaultAside: {
          id: 'defaultAside',
          text: 'Default Aside',
          path: 'aside-types/default-aside',
          icon: 'ViewQuilt',
        },
        minimizeAside: {
          id: 'minimizeAside',
          text: 'Minimize Aside',
          path: 'aside-types/minimize-aside',
          icon: 'View Compact',
        },
      },
    },
  };

	const { asideStatus, setAsideStatus } = useContext(ThemeContext);

	const { asideStyle, touchStatus, hasTouchButton, asideWidthWithSpace, x } = useAsideTouch();

	const isModernDesign = process.env.REACT_APP_MODERN_DESGIN === 'true';

	const constraintsRef = useRef(null);


	const { t } = useTranslation(['translation', 'menu']);

	const { darkModeStatus } = useDarkMode();
  
  // const layoutMenu = {layoutTypes: {…}, blank: {…}, pageLayout: {…}, asideTypes: {…}}

  

	return (
		<>
			<motion.aside
				style={asideStyle}
				className={classNames(
					'aside',
					{ open: asideStatus },
					{
						'aside-touch-bar': hasTouchButton && isModernDesign,
						'aside-touch-bar-close': !touchStatus && hasTouchButton && isModernDesign,
						'aside-touch-bar-open': touchStatus && hasTouchButton && isModernDesign,
					},
				)}>
				<div className='aside-head'>
					<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
				</div>
				<div className='aside-body'>
					<Navigation menu={dashboardMenu} id='aside-dashboard' />
				
						<>
							<NavigationLine />
							<Navigation menu={demoPages} id='aside-demo-pages' />
							<NavigationLine />
						
						</>
					

				

			
				</div>
			
			</motion.aside>
			{asideStatus && hasTouchButton && isModernDesign && (
				<>
					<motion.div className='aside-drag-area' ref={constraintsRef} />
					<Tooltips title='Toggle Aside' flip={['top', 'right']}>
						<motion.div
							className='aside-touch'
							drag='x'
							whileDrag={{ scale: 1.2 }}
							whileHover={{ scale: 1.1 }}
							dragConstraints={constraintsRef}
							// onDrag={(event, info) => console.log(info.point.x, info.point.y)}
							dragElastic={0.1}
							style={{ x, zIndex: 1039 }}
							onClick={() => x.set(x.get() === 0 ? asideWidthWithSpace : 0)}
						/>
					</Tooltips>
				</>
			)}
		</>
	);
};

export default Aside;
