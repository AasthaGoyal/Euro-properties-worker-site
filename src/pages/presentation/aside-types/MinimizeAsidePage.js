import React from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import useMinimizeAside from '../../../hooks/useMinimizeAside';
import { layoutMenu } from '../../../menu';
import Popovers from '../../../components/bootstrap/Popovers';

const MinimizeAsidePage = () => {
	useMinimizeAside();
	return (
		<PageWrapper title={layoutMenu.asideTypes.subMenu.minimizeAside.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{ title: 'Page Layout', to: '/page-layouts' },
							{
								title: 'Header & Subheader',
								to: '/page-layouts/header-and-subheader',
							},
						]}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Popovers
						title='MinimizeAsidePage.js'
						desc={<code>src/pages/presentation/aside-types/MinimizeAsidePage.js</code>}>
						SubHeaderRight
					</Popovers>
					<code>MinimizeAsidePage.js</code>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='col-12 d-flex justify-content-center align-items-center'
						style={{ fontSize: 'calc(1rem + 1vw)' }}>
						<Popovers
							title='MinimizeAsidePage.js'
							desc={
								<code>src/pages/presentation/aside-types/MinimizeAsidePage.js</code>
							}>
							Page
						</Popovers>
						<code className='ps-3'>MinimizeAsidePage.js</code>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default MinimizeAsidePage;
