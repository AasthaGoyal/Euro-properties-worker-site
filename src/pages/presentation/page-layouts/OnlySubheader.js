import React from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import { layoutMenu } from '../../../menu';
import Popovers from '../../../components/bootstrap/Popovers';

const OnlySubheader = () => {
	return (
		<PageWrapper title={layoutMenu.pageLayout.subMenu.onlySubheader.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{ title: 'Page Layout', to: '/page-layouts' },
							{
								title: 'Only Subheader',
								to: '/page-layouts/only-subheader',
							},
						]}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Popovers
						title='OnlySubheader.js'
						desc={<code>src/pages/presentation/page-layouts/OnlySubheader.js</code>}>
						SubHeaderRight
					</Popovers>
					<code>OnlySubheader.js</code>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='col-12 d-flex justify-content-center align-items-center'
						style={{ fontSize: 'calc(1rem + 1vw)' }}>
						<Popovers
							title='OnlySubheader.js'
							desc={
								<code>src/pages/presentation/page-layouts/OnlySubheader.js</code>
							}>
							Page
						</Popovers>
						<code className='ps-3'>OnlySubheader.js</code>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default OnlySubheader;
