import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from '../../../components/bootstrap/Button';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, {
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';

import { demoPages } from '../../../menu';
import { Link } from 'react-router-dom';
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "../../../actions/actionConstant";
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useDarkMode from '../../../hooks/useDarkMode';
import EVENT_TASK from '../../common/data/enumEventTasks';
import Input from '../../../components/bootstrap/forms/Input';
import { useFormik } from 'formik';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Select from '../../../components/bootstrap/forms/Select';
import CommonFilterTag from '../../common/CommonFilterTag';
import Moment from "react-moment";

const ListAllTasks = () => {
  const { themeStatus, darkModeStatus } = useDarkMode();

  const [tasks, setTasks] = useState([]);
  const [perPage, setPerPage] = useState(PER_COUNT['5']);
  const [modal, setModal] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const [jobsites, setJobsites] = useState([]);

  React.useEffect(() => {

    setLoading(true);
    axios.get(`${BASE_URL}/api/tasks`).then((res) => {
      setTasks(res.data);
      setLoading(false);
    });

    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      setJobsites(res.data);
    });

    axios.get(`${BASE_URL}/api/users`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  const openModal = (id) => {
    // setTaskId(id)
    setModal(!modal);
    setTaskId(id);
    console.log("Task:", id);
  };

  const changeStatus = (e) => {
    e.preventDefault();
    console.log("value changed", e.target.value);
  }
  // // const { themeStatus, darkModeStatus } = useDarkMode();
  // const [currentPage, setCurrentPage] = useState(1);


  // const { users, requestSort, getClassNamesFor } = useSortableData(userdata);

  // console.log("sorted users", users);
  // const { jsonUsers } = JSON.stringify(users);
  let taskTable;

  // Get current posts
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  console.log("tasks:", currentTasks);

  if (currentTasks.length === 0) {
    taskTable = (
      <tr>
        <td colSpan="6">No records</td>
      </tr>
    );
  } else {
    taskTable = _.map(currentTasks, (task) => {
      // let users = _.filter(users, ['_id', task.user]);
      console.log("each task has", task);
      let jobsiteList = _.map(jobsites, (job) => {
        if (job._id == task.jobsite) {
          return (
            <option key={job._id} value={job._id}>
              {job.address}
            </option>
          );
        }

      });

      // let workersList = _.map(users, (user) => {
      //   task.workersAssign((worker) => {
      //     if(user.username == worker)
      //     {
      //       return (
      //         <option key={user._id} value={user._id}>
      //         {user.username}
      //       </option>
      //       )
      //     }
      //   })
      // });


      const workersList = task.workersAssign.map((worker) => {

        return (
          <option >
            {worker}
          </option>
        )

      });


      return (
        <tr key={task._id}>
          <td>

          <Link to={`../${demoPages.Tasks.subMenu.editTasks.path}/${task._id}`}>
            {task.taskTitle}
          </Link>
          </td>


          <td>{jobsiteList}</td>
          <td> {workersList}</td>
          <td>
            <Moment date={task.startDate} format={'DD/MM/YYYY'} />
          </td>
          <td>
            <Moment date={task.endDate} format={'DD/MM/YYYY'} />
          </td>



          <td>
            <Dropdown onChange={changeStatus}>
              <DropdownToggle hasIcon={false}>
                <Button
                  isLink
                  color={task.status == "Completed" ? "success" : "danger"}
                  icon='Circle'
                  value={task.status}
                  className='text-nowrap' onChange={changeStatus}>
                  {task.status}
                </Button>
              </DropdownToggle>
              <DropdownMenu>
                {Object.keys(EVENT_TASK).map((key) => (
                  <DropdownItem key={key}>
                    <div>
                      <Icon
                        icon='Circle'
                        color={EVENT_TASK[key].color}
                      />
                      {EVENT_TASK[key].name}
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </td>

        </tr>
      );
    });
  }

  let taskLoading;

  if (loading) {
    taskLoading = (
      <tr>
        <td colSpan="6">
          <h3>Loading...</h3>
        </td>
      </tr>
    );
  } else {
    taskLoading = taskTable;
  }



  // const searchbyStatus = (e) => {
  //   setStatus(e.target.value);
  //   axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
  //     console.log("jobsites", res.data);
  //     let status = e.target.value;
  //     let jobsiteData = res.data;

  //     if (status === 'All') {
  //       setJobsites(jobsiteData);
  //     } else {
  //       var jobsiteResult = _.filter(jobsiteData, ['status', status]);

  //       setJobsites(jobsiteResult);
  //     }
  //   });
  // }

  // const searchByAssigned = (e) => {
  //   setAssigned(e.target.value);
  //   axios.get(`${BASE_URL}/api/jobassigntoemployees`)
  //     .then(res => setAssignedJobsites(res.data));
  // }




  return (
    <PageWrapper title="Jobsites">
      <SubHeader>
        <SubHeaderLeft>
          <div className='d-flex' data-tour='search'>
            <label className='border-0 bg-transparent cursor-pointer' htmlFor='searchInput'>
              <Icon icon='Search' size='2x' color='primary' />
            </label>
            <Input
              id='searchInput'
              type='search'
              className='border-0 shadow-none bg-transparent'
              placeholder='Search...'

              autoComplete='off'
            />
          </div>
        </SubHeaderLeft>
        <SubHeaderRight>
          {/* {status && (
            <CommonFilterTag title='Status' text={status} />
          )}

          {assigned && (
            <CommonFilterTag title='Job type' text={assigned} />
          )} */}


          <SubheaderSeparator />
          {/* <Dropdown >
            <DropdownToggle hasIcon={false}>
              <Button icon='Filter' color='primary' isLight data-tour='filter'>
                Filter

              </Button>
            </DropdownToggle>
            <DropdownMenu
              isAlignmentEnd
              size='lg'
              isCloseAfterLeave={false}
              data-tour='filter-menu'>
              <div className='container py-2'>
                <form className='row g-3' >

                  <div className='col-12'>
                    <FormGroup>
                      <Label htmlFor='assignedFilter'>Jobsite Type</Label>
                      <Select
                        id='assignedFilter'
                        ariaLabel='type'

                        onChange={searchByAssigned}
                        list={[
                          { value: 'All', text: 'All' },
                          { value: 'Assigned', text: 'Assigned' },
                          { value: 'Unassigned', text: 'Unassigned' },

                        ]}
                        value={assigned}

                      />
                    </FormGroup>
                  </div>
                  <div className='col-12'>
                    <FormGroup>
                      <Label htmlFor='statusFilter'>Jobsite Status</Label>
                      <Select
                        id='statusFilter'
                        ariaLabel='status'
                        placeholder='Jobsite status'
                        onChange={searchbyStatus}
                        list={[
                          { value: 'All', text: 'All' },
                          { value: 'Active', text: 'Active' },
                          { value: 'Inactive', text: 'Inactive' },

                        ]}
                        value={status}
                      />
                    </FormGroup>
                  </div>


                </form>
              </div>
            </DropdownMenu>
          </Dropdown> */}

        </SubHeaderRight>
      </SubHeader>


      <Page container='fluid'>
        <Card >
          <CardHeader borderSize={1}>
            <CardLabel icon='Task2' >

              <CardTitle>Tasks</CardTitle>

            </CardLabel>
            <CardActions>


            </CardActions>

          </CardHeader>


          <CardBody className='table-responsive' >


            <table className='table table-modern'>
              <thead>
                <tr>

                  <th>Task Name</th>
                  <th>Jobsite</th>
                  <th>Workers</th>
                  <th>Start Date</th>
                  <th>End date</th>

                  <th>Status</th>
                  <td />

                </tr>
              </thead>
              <tbody>
                {taskLoading}
                {/* {filteredData.map((i) => (
									<CommonTableRow
										key={i.id}
										// eslint-disable-next-line react/jsx-props-no-spreading
										{...i}
										selectName='selectedList'
										selectOnChange={selectTable.handleChange}
										selectChecked={selectTable.values.selectedList.includes(
											i.id.toString(),
										)}
									/>
								))} */}
              </tbody>
            </table>
          </CardBody>
          <PaginationButtons
            data={tasks}
            label='items'
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </Card>


      </Page>
    </PageWrapper>
  );
};


ListAllTasks.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ListAllTasks);
