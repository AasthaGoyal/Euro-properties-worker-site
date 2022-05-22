import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import Page from '../../../layout/Page/Page';
import classNames from 'classnames';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import { demoPages } from '../../../menu';
import tableData from '../../../common/data/dummyProductData';
import Avatar from '../../../components/Avatar';
import USERS from '../../../common/data/userDummyData';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import { priceFormat } from '../../../helpers/helpers';
import Chart from '../../../components/extras/Chart';
import Accordion, { AccordionItem } from '../../../components/bootstrap/Accordion';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import showNotification from '../../../components/extras/showNotification';
import useDarkMode from '../../../hooks/useDarkMode';
import axios from 'axios';
import { BASE_URL } from '../../../actions/actionConstant';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Picky } from 'react-picky';
import 'react-picky/dist/picky.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import _ from 'lodash';
import Moment from 'react-moment';
import { idea } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import jwt_decode from 'jwt-decode';

const EditTasks = () => {
	const { darkModeStatus } = useDarkMode();

	const [redirect, setRedirect] = useState(false);
	const [modal, setModal] = useState(false);

	const [eventItem, setEventItem] = useState(null);
	const [jobsites, setJobsites] = useState([]);
	const [workersAssign, setWorkersAssign] = useState([]);
	const [workersList, setWorkersList] = useState([]);
	const [taskTitle, setTaskTitle] = useState();
	const [taskDescription, setTaskDescription] = useState();

	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [jobsiteName, setJobsiteName] = useState();
	const [jobsite, setJobsite] = useState();
	const [notes, setNotes] = useState();
	const [jobsiteId, setJobsiteId] = useState();
	const [workersId, setWorkersId] = useState([]);

	const [comments, setComments] = useState([]);
	const [fileInputState, setFileInputState] = useState('');
	const [selectedFile, setSelectedFile] = useState('');
	const [previewSource, setPreviewSource] = useState('');
	// const [successMsg, setSuccessMsg] = useState("");
	// const [errMsg, setErrMsg] = useState("");
	const [commentText, setCommentText] = useState();
	const [employeeId, setEmployeeId] = useState();
	const [employees, setEmployees] = useState([]);
	const token = localStorage.getItem('jwtToken');

	const decoded = jwt_decode(token);
	const user = decoded;

	const [users, setUsers] = useState([]);

	const onChangeTaskTitle = (e) => {
		setTaskTitle(e.target.value);
	};

	const onChangeTaskDescription = (e) => {
		setTaskDescription(e.target.value);
	};

	const onChangeNotes = (e) => {
		setNotes(e.target.value);
	};

	const { id } = useParams();
	console.log('task id is', id);

	const navigate = useNavigate();

	// const itemData = tableData.filter((item) => item.id.toString() === id.toString());
	// const data = itemData[0];

	const TABS = {
		ACCOUNT_DETAIL: 'Task Details',
		TASK_COMPLETION: 'Add Task Photo/Comment ',
		TASK_COMMENTS: 'View Task Comments',
	};

	const [activeTab, setActiveTab] = useState(TABS.ACCOUNT_DETAIL);
	const [toggleInfoEventCanvas, setToggleInfoEventCanvas] = useState(false);
	const setInfoEvent = () => setToggleInfoEventCanvas(!toggleInfoEventCanvas);
	const [events, setEvents] = useState([]);

	const openModal = () => {
		// setUserId(id)
		setModal(!modal);
	};

	useEffect(() => {
		axios.get(`${BASE_URL}/api/taskComments`).then((res) => {
			let comments = res.data;
			let filterComments = _.filter(comments, ['task', id]);
			setComments(filterComments);
		});

		axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
			setJobsites(res.data);
		});

		axios.get(`${BASE_URL}/api/users`).then((res) => {
			setUsers(res.data);
			setEmployeeId(user.id);
		});

		axios.get(`${BASE_URL}/api/tasks/${id}`).then((res) => {
			setTaskTitle(res.data.taskTitle);
			setTaskDescription(res.data.taskDescription);

			res.data.startDate && setStartDate(new Date(res.data.startDate));
			res.data.endDate && setEndDate(new Date(res.data.endDate));

			setJobsiteId(res.data.jobsite);
			setWorkersId(res.data.workersAssign);
			setNotes(res.data.note);
		});
	}, []);

	let jobs = [];

	_.map(jobsites, (job) => {
		jobs.push(job.address);
	});

	let workers = [];
	_.map(users, (user) => {
		let userObject = _.filter(users, ['_id', user._id]);
		if (userObject.length === 0) {
		} else {
			workers.push(userObject[0].firstName + ' ' + userObject[0].lastName);
		}
	});

	let demo = '';

	_.map(jobsites, (job) => {
		if (job._id == jobsiteId) {
			console.log(job.address);
			demo = job.address;
		}
	});

	let finalusers = [];
	workersId.map((wrk) => {
		_.map(users, (user) => {
			if (user._id == wrk) {
				finalusers.push(user.firstName + ' ' + user.lastName);
			}
		});
	});

	const deleteTask = () => {
		axios
			.delete(`${BASE_URL}/api/tasks/${id}`)
			.then((response) => {
				axios.get(`${BASE_URL}/api/tasks/`).then((response) => {
					console.log(response.data);
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='EmojiSmile' size='lg' className='me-1' />
							<span>Task Deleted Successfully</span>
						</span>,
						'The Task has been deleted successfully.',
						'warning',
					);
					navigate(-1);
				});
				setModal(!modal);
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

		//setSucess(true);
		setTimeout(() => {
			// setSucess(false);
		}, 3000);
	};

	const onEditSubmit = (e) => {
		e.preventDefault();

		const taskObject = {
			jobsite,
			taskTitle,
			taskDescription,
			startDate,
			endDate,
			workersAssign,
			status: 'Pending',
			note: notes,
		};

		axios
			.put(`${BASE_URL}/api/tasks/edit/${id}`, taskObject)
			.then((res) => {
				if (res.status == 200) {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='EmojiSmile' size='lg' className='me-1' />
							<span>Task Updated Successfully</span>
						</span>,
						'The Task has been updated successfully.',
						'success',
					);
					axios.get(`${BASE_URL}/api/tasks/${id}`).then((res) => {
						console.log('the response is', res.data);
						setTaskTitle(res.data.taskTitle);
						setTaskDescription(res.data.taskDescription);

						res.data.startDate && setStartDate(new Date(res.data.startDate));
						res.data.endDate && setEndDate(new Date(res.data.endDate));

						setJobsiteId(res.data.jobsite);
						setWorkersId(res.data.workersAssign);
						setNotes(res.data.note);
					});
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

	const previewFile = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setPreviewSource(reader.result);
		};
	};

	const onSubmitTask = () => {
		//e.preventDefault();

		const commentObject = {
			employee: employeeId,
			task: id,
			commentText,
		};

		axios
			.post(`${BASE_URL}/api/taskComments/addtaskCommentmanager`, commentObject)
			.then((res) => {
				console.log('Response comment:', res.data);
				if (res.status == 200) {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='EmojiSmile' size='lg' className='me-1' />
							<span>Comment Added Successfully</span>
						</span>,
						'The Task Comment has been added successfully.',
						'success',
					);
				}
			});

		axios.get(`${BASE_URL}/api/taskComments`).then((res) => {
			let comments = res.data;
			let filterComments = _.filter(comments, ['task', id]);
			setComments(filterComments);
		});
	};

	const handleFileInputchange = (e) => {
		const file = e.target.files[0];

		console.log(file);

		previewFile(file);

		setSelectedFile(file);
		setFileInputState(e.target.value);
	};

	const handleSubmitFile = (e) => {
		e.preventDefault();

		if (fileInputState === '') {
			console.log('File Is not selected');
			onSubmitTask();
		} else {
			if (!selectedFile) return;
			const reader = new FileReader();
			reader.readAsDataURL(selectedFile);
			reader.onloadend = () => {
				uploadImage(reader.result);
			};
			reader.onerror = () => {
				console.error('AHHHHHHHH!!');
				//setErrMsg("something went wrong!");
			};
		}
	};

	const uploadImage = async (base64EncodedImage) => {
		console.log('base64EncodedImage:', base64EncodedImage);
		let pictureObj = {
			employee: employeeId,
			task: id,
			commentImage: base64EncodedImage,
			commentText,
		};

		console.log('pictureObj:', pictureObj);

		try {
			await fetch(`${BASE_URL}/api/taskComments/addtaskComment`, {
				method: 'POST',
				body: JSON.stringify({ data: pictureObj }),
				headers: { 'Content-Type': 'application/json' },
			});
			setFileInputState('');
			setPreviewSource('');
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='EmojiSmile' size='lg' className='me-1' />
					<span>Comment Added Successfully</span>
				</span>,
				'The Task Comment has been added successfully.',
				'success',
			);

			axios.get(`${BASE_URL}/api/taskComments`).then((res) => {
				let comments = res.data;
				let filterComments = _.filter(comments, ['task', id]);
				setComments(filterComments);
			});
		} catch (err) {
			console.error(err);
			//setErrMsg("Something went wrong!");
		}
	};

	const deleteComment = (deleteid) => {
		console.log('Deleted comment:', deleteid);
		axios.delete(`${BASE_URL}/api/taskComments/${deleteid}`).then((res) => {
      console.log(res);
			if (res.status == 200) {
				axios.get(`${BASE_URL}/api/taskComments`).then((res) => {
					let comments = res.data;
					let filterComments = _.filter(comments, ['task', id]);
					setComments(filterComments);
         
				});
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='EmojiSmile' size='lg' className='me-1' />
						<span>Deleted Successfully</span>
					</span>,
					'The Task Comment has been deleted successfully.',
					'warning',
				);
			}
		});
	};

	const onChangeCommentText = (e) => setCommentText(e.target.value);

	let commentsList;

	console.log('comments are', comments);
	if (comments.length === 0) {
		commentsList = 'Comments are not avaialble';
	} else {
		commentsList = _.map(comments, (comment) => {
			let fullname;

			users.map((user) => {
				if (user._id == comment.employee) {
					fullname = user.firstName + ' ' + user.lastName;
				}
			});

			return (
				<tr key={comment._id}>
					<td>
						
						<img src={comment.commentImage}  alt='' width={54} height={54} />
					</td>
					<td>{comment.commentText}</td>
					<td> {fullname} </td>

					<td>
						<Button
							isOutline={!darkModeStatus}
							color='danger'
							isLight={darkModeStatus}
							onClick={deleteComment.bind(this, comment._id)}
							className={classNames('text-nowrap', {
								'border-light': !darkModeStatus,
							})}
							icon='Delete'>
							Delete
						</Button>
					</td>
				</tr>
			);
		});
	}

  
	return (
		<PageWrapper title='Edit User'>
			<Modal isOpen={modal} toggle={openModal}>
				<ModalHeader toggle={openModal}>Delete User</ModalHeader>
				<ModalBody>Do you want to delete the user?</ModalBody>
				<ModalFooter>
					<Button color='primary' className='btn-theme btn-sm' onClick={deleteTask}>
						Yes Delete
					</Button>{' '}
					<Button color='secondary' className='btn-sm' onClick={openModal}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
			<SubHeader>
				<SubHeaderLeft>
					<Button color='info' isLink icon='ArrowBack' onClick={() => navigate(-1)}>
						Back to List
					</Button>
					<SubheaderSeparator />

					<span>
						<strong>{taskTitle}</strong>
					</span>
					<span className='text-muted'>Edit Task</span>
				</SubHeaderLeft>
				<SubHeaderRight></SubHeaderRight>
			</SubHeader>
			<Page container='fluid'>
				<div className='row h-100'>
					<div className='col-xxl-3 col-xl-4 col-lg-6'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='Contact' iconColor='info'>
									<CardTitle>Task Settings</CardTitle>
									<CardSubTitle>Jobsite/Task Information</CardSubTitle>
								</CardLabel>
							</CardHeader>
							<CardBody isScrollable>
								<div className='row g-3'>
									<div className='col-12'>
										<Button
											icon='Contacts'
											color='info'
											className='w-100 p-3'
											isLight={TABS.ACCOUNT_DETAIL !== activeTab}
											onClick={() => setActiveTab(TABS.ACCOUNT_DETAIL)}>
											{TABS.ACCOUNT_DETAIL}
										</Button>
									</div>
									<div className='col-12'>
										<Button
											icon='Easel'
											color='success'
											className='w-100 p-3'
											isLight={TABS.TASK_COMPLETION !== activeTab}
											onClick={() => setActiveTab(TABS.TASK_COMPLETION)}>
											{TABS.TASK_COMPLETION}
										</Button>
									</div>
									<div className='col-12'>
										<Button
											icon='Flag'
											color='warning'
											className='w-100 p-3'
											isLight={TABS.TASK_COMMENTS !== activeTab}
											onClick={() => setActiveTab(TABS.TASK_COMMENTS)}>
											{TABS.TASK_COMMENTS}
										</Button>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-xxl-9 col-xl-8 col-lg-6'>
						{TABS.ACCOUNT_DETAIL === activeTab && (
							<Card stretch tag='form' noValidate>
								<CardHeader>
									<CardLabel icon='Edit' iconColor='info'>
										<CardTitle>Task Information</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='pb-0' isScrollable>
									<div className='row g-4'>
										<div className='col-lg-12'>
											<FormGroup
												className='col-lg-12'
												id='jobsitename'
												label='Jobsite Address '>
												<p className='h6'> {demo}</p>
											</FormGroup>
										</div>
										<div className='col-lg-12'>
											<FormGroup
												className='col-lg-12'
												id='workers'
												label='Workers '>
												<p className='h6'> {finalusers}</p>
											</FormGroup>
										</div>
										<div className='col-lg-12'>
											<FormGroup
												className='col-lg-12'
												id='taskName'
												label='Task Name '>
												<p className='h6'> {taskTitle}</p>
											</FormGroup>
										</div>
										<div className='col-lg-12'>
											<FormGroup
												className='col-lg-12'
												id='taskDesc'
												label='Task Description'>
												<p className='h6'> {taskDescription}</p>
											</FormGroup>
										</div>
										<div className='col-md-6'>
											<FormGroup>
												<label>Start Date</label>

												<DatePicker
													selected={startDate}
													className='form-control'
													placeholder='Start Date'
												/>
											</FormGroup>
										</div>
										<div className='col-md-6'>
											<FormGroup>
												<label>End Date</label>
												<DatePicker
													selected={endDate}
													className='form-control'
													placeholder='End Date'
												/>
											</FormGroup>
										</div>{' '}
										<div className='col-lg-12'>
											<FormGroup
												className='col-lg-12'
												id='notes'
												label='Notes'>
												<p className='h6'> {notes}</p>
											</FormGroup>
										</div>
									</div>
								</CardBody>
								<CardFooter>
									<CardFooterRight>
										<Button
											type='submit'
											icon='Save'
											color='info'
											onClick={onEditSubmit}>
											Submit
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						)}

						{TABS.TASK_COMPLETION === activeTab && (
							<Card stretch tag='form' noValidate>
								<CardHeader>
									<CardLabel icon='Edit' iconColor='success'>
										<CardTitle>Add New Task Comment</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='pb-0' isScrollable>
									<div className='row g-4'>
										<div className='col-lg-12'>
											<FormGroup
												className='col-lg-12'
												id='picture'
												label='Task Photo '>
												<Input
													type='file'
													name='picture'
													className='form-control'
													onChange={handleFileInputchange}
													value={fileInputState}
												/>
											</FormGroup>
										</div>
										<div className='col-lg-12'>
											<FormGroup
												className='col-lg-12'
												id='comments'
												label='Comments '>
												<Input
													type='text'
													name='comments'
													className='form-control'
													onChange={onChangeCommentText}
												/>
											</FormGroup>
										</div>

										<div className='col-lg-12'>
											{previewSource && (
												<img
													src={previewSource}
													alt='chosen'
													style={{ height: '160px' }}
												/>
											)}
										</div>
									</div>
								</CardBody>
								<CardFooter>
									<CardFooterRight>
										<Button
											type='submit'
											icon='Save'
											color='info'
											onClick={handleSubmitFile}>
											Submit
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						)}
						{TABS.TASK_COMMENTS === activeTab && (
							<Card stretch tag='form' noValidate>
								<CardHeader>
									<CardLabel icon='Edit' iconColor='warning'>
										<CardTitle>View Task Comments</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='pb-0 table-responsive' isScrollable>
									<table className='table table-modern'>
										<thead>
											<tr>
												<th scope="col">Image</th>
												<th scope="col">Comment</th>
												<th scope="col">By</th>
												<th scope="col"> Action </th>
												<td />
											</tr>
										</thead>
										<tbody>{commentsList}</tbody>
									</table>
								</CardBody>
								<CardFooter>
									<CardFooterRight></CardFooterRight>
								</CardFooter>
							</Card>
						)}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default EditTasks;
