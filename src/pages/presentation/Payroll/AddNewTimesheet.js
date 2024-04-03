import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../actions/actionConstant';
import { useFormik, validateYupSchema } from 'formik';
import moment from 'moment';
import classNames from 'classnames';
import { useMeasure } from 'react-use';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTabItem,
	CardTitle,
} from '../../../components/bootstrap/Card';
import UserImageWebp from '../../../assets/img/wanna/wanna1.webp';
import UserImage from '../../../assets/img/wanna/wanna1.png';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Alert from '../../../components/bootstrap/Alert';
import Avatar from '../../../components/Avatar';
import Progress from '../../../components/bootstrap/Progress';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import { demoPages } from '../../../menu';
import WannaImg1 from '../../../assets/img/wanna/slide/scene-1.png';
import WannaImg2 from '../../../assets/img/wanna/slide/scene-2.png';
import WannaImg5 from '../../../assets/img/wanna/slide/scene-5.png';
import WannaImg6 from '../../../assets/img/wanna/slide/scene-6.png';
import Carousel from '../../../components/bootstrap/Carousel';
import CarouselSlide from '../../../components/bootstrap/CarouselSlide';
import useDarkMode from '../../../hooks/useDarkMode';
import { ToastContainer, toast } from 'react-toastify';
import { Picky } from 'react-picky';
import 'react-picky/dist/picky.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import jwt_decode from 'jwt-decode';

const AddNewTimesheet = (props) => {
	const token = localStorage.getItem('jwtToken');

	const decoded = jwt_decode(token);
	const user = decoded;
	const [eventItem, setEventItem] = useState(null);
	const [jobsites, setJobsites] = useState([]);
	const [workersAssign, setWorkersAssign] = useState([]);
	const [users, setUsers] = useState([]);
	const [workersList, setWorkersList] = useState([]);
	const [taskTitle, setTaskTitle] = useState();
	const [taskDescription, setTaskDescription] = useState();

	const [totalTime, setTotalTime] = useState([]);
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [jobsiteName, setJobsiteName] = useState();
	const [jobsite, setJobsite] = useState();
	const [notes, setNotes] = useState();
	const navigate = useNavigate();

	const onChangeTaskTitle = (e) => {
		setTaskTitle(e.target.value);
	};

	const onChangeTaskDescription = (e) => {
		setTaskDescription(e.target.value);
	};

	const onChangeNotes = (e) => {
		setNotes(e.target.value);
	};

	const calculateTime = () => {
		console.log('calculating time, startsdate', startDate, 'and end date', endDate);
		var start = moment(startDate);
		var end = moment(endDate);
		let thours = end.diff(start, 'hours', true);
		let finalHours = Math.round(thours * 100) / 100;
		setTotalTime(finalHours);
	};
	const onSubmitTimesheet = (e) => {
		e.preventDefault();

		let today = new Date();

		console.log('todays date is', today);
		console.log('jobsite id is', jobsite);
		const timesheetObj = {
			attendanceDate: startDate,
			breakHours: 0,
			createdAt: today,
			employee: user.id,
			jobsite: jobsite,
			punchinTime: startDate,
			punchoutTime: endDate,
			totalWorkHours: totalTime,
		};

		console.log('punchInObj:', timesheetObj);

		axios
			.post(`${BASE_URL}/api/employeeTimesheetFinal/addemployeeTimesheetFinal`, timesheetObj)
			.then((res) => {
				console.log('timsheet added res:', res);

				if (res.status === 200) {
					console.log('Timesheet details:', res.data);

					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='EmojiSmile' size='lg' className='me-1' />
							<span>New Jobsite Added</span>
						</span>,
						'The new timesheet has been successfully added.',
						'success',
					);
					navigate('/view-timesheets');
				}
			})
			.catch((err) => {
				console.log(err);
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='EmojiAngry' size='lg' className='me-1' />
						<span>Some error occured</span>
					</span>,
					'Some error occured. Please check the details or try again later.',
					'danger',
				);
			});
	};

	const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark'];
	let jobs = [];

	_.map(jobsites, (job) => {
		jobs.push(job.address);
	});

	let workers = [];
	_.map(users, (user) => {
		let userObject = _.filter(users, ['_id', user._id]);
		if (userObject.length === 0) {
		} else {
			workers.push(userObject[0].username);
		}
	});

	useEffect(() => {
		//Get Jobsites list
		axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
			setJobsites(res.data);
		});

		axios.get(`${BASE_URL}/api/users`).then((res) => {
			setUsers(res.data);
		});
	}, []);

	console.log('Worker Assigns:', workersAssign);

	return (
		<PageWrapper title='Add New User'>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-xxl-12 col-xl-6'>
						<Card className='shadow-3d-primary'>
							<CardBody>
								<div className='row g-5'>
									<div className='col-12'>
										<div className='d-flex align-items-center'>
											<div className='flex-grow-1 ms-3'>
												<div className='h2 fw-bold'>Add New Timesheet</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>

						<Card tag='form'>
							<Card className='rounded-2' tag='form'>
								<CardHeader>
									<CardLabel icon='Task'>
										<CardTitle>Timesheet Information</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-4'>
										<FormGroup label='Jobsite *'>
											<Picky
												id='picky1'
												options={jobs}
												value={jobsiteName}
												multiple={false}
												includeSelectAll={true}
												includeFilter={true}
												onChange={(jobsite) => {
													setJobsiteName(jobsite);

													let selectedJobsite = _.filter(jobsites, [
														'address',
														jobsite,
													]);

													console.log(
														'selectedJobsite:',
														selectedJobsite,
													);

													setJobsite(selectedJobsite[0]._id);
												}}
												dropdownHeight={600}
											/>
										</FormGroup>

										<FormGroup className='col-md-4'>
											<label>Start Date</label>

											<DatePicker
												showTimeSelect
												dateFormat='MMMM d, yyyy h:mmaa'
												selected={startDate}
												onChange={(date) => {
													setStartDate(date);
													calculateTime();
												}}
												className='form-control col-md-6'
												placeholder='Start Date'
											/>
										</FormGroup>

										<FormGroup className='col-md-4'>
											<label>End Date</label>
											<DatePicker
												showTimeSelect
												dateFormat='MMMM d, yyyy h:mmaa'
												selected={endDate}
												onChange={(date) => {
													setEndDate(date);
													calculateTime();
												}}
												className='form-control'
												placeholder='End Date'
											/>
										</FormGroup>

										<FormGroup className='col-md-4'>
											<label>Total Time </label>
											<p>
												{' '}
												<b>{totalTime} hours</b>
											</p>
										</FormGroup>
									</div>
								</CardBody>
							</Card>

							<CardFooter>
								<CardFooterRight>
									<Button
										type='submit'
										color='info'
										icon='Save'
										onClick={onSubmitTimesheet}>
										Add Timesheet
									</Button>
								</CardFooterRight>
							</CardFooter>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

AddNewTimesheet.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	//
	auth: state.auth,
});

export default connect(mapStateToProps)(AddNewTimesheet);
