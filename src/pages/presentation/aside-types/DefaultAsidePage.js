import React from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import { layoutMenu } from '../../../menu';
import Popovers from '../../../components/bootstrap/Popovers';

const DefaultAsidePage = () => {
	return (
		<PageWrapper title={layoutMenu.asideTypes.subMenu.defaultAside.text}>
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
						title='DefaultAsidePage.js'
						desc={<code>src/pages/presentation/aside-types/DefaultAsidePage.js</code>}>
						SubHeaderRight
					</Popovers>
					<code>DefaultAsidePage.js</code>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='col-12 d-flex justify-content-center align-items-center'
						style={{ fontSize: 'calc(1rem + 1vw)' }}>
						<Popovers
							title='DefaultAsidePage.js'
							desc={
								<code>src/pages/presentation/aside-types/DefaultAsidePage.js</code>
							}>
							Page
						</Popovers>
						<code className='ps-3'>DefaultAsidePage.js</code>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default DefaultAsidePage;
