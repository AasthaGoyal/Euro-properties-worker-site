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
import showNotification from '../../../components/extras/showNotification';

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
  const [filteredJobsite, setFilteredValue] = useState("All");
  const [jobsite, setJobsite] = useState();
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

  const changeStatus = (id, value) => {


    _.map(tasks, (task) => {
      if (task._id == id) {

        const taskObject = {
          jobsite: task.jobsite,
          taskTitle: task.taskTitle,
          taskDescription: task.taskDescription,
          startDate: task.startDate,
          endDate: task.endDate,
          workersAssign: task.workersAssign,
          status: value,
        };
        
        axios
          .put(`${BASE_URL}/api/tasks/edit/${id}`, taskObject)
          .then((res) => {
            if (res.status == 200) {
              showNotification(
                <span className='d-flex align-items-center'>
                  <Icon icon='Info' size='lg' className='me-1' />
                  <span>Task's status Updated Successfully</span>
                </span>,
                "The Task's status has been updated successfully.",
              );
            }
          });

        window.location.reload();
        showNotification(
          <span className='d-flex align-items-center'>
            <Icon icon='Info' size='lg' className='me-1' />
            <span>Task's status Updated Successfully</span>
          </span>,
          "The Task's status has been updated successfully.",
        );
      }
    })


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


  if (currentTasks.length === 0) {
    taskTable = (
      <tr>
        <td colSpan="6">No records</td>
      </tr>
    );
  } else {
    taskTable = _.map(currentTasks, (task) => {
      // let users = _.filter(users, ['_id', task.user]);

      let jobsiteList = _.map(jobsites, (job) => {
        if (job._id == task.jobsite) {
          return (
            <option key={job._id} value={job._id}>
              {job.address}
            </option>
          );
        }

      });

      let workersList = task.workersAssign;

      let finalusers = [];
      workersList.map((wrk) => {
        _.map(users, (user) => {
          if (user._id == wrk) {
            console.log("matching ", user._id, "name", user.username, "work", wrk);
            finalusers.push(user.username);
          }
        })
      });

      console.log(finalusers);



      //  console.log("woekres is", workersList);
      return (
        <tr key={task._id}>
          <td>

            <Link to={`../${demoPages.Tasks.subMenu.editTasks.path}/${task._id}`}>
              {task.taskTitle}
            </Link>
          </td>
          <td>{jobsiteList}</td>
          <td> {finalusers.map(worker => {
            return (
              <div className="form-control"> {worker} {""} </div>
            )
          }



          )}</td>


          <td>
            <Moment date={task.startDate} format={'DD/MM/YYYY'} />
          </td>
          <td>
            <Moment date={task.endDate} format={'DD/MM/YYYY'} />
          </td>



          <td>
            <Dropdown>
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
                <DropdownItem key='completed' value='completed'  >
                  <Button
                    isLink
                    color='success'
                    icon='Circle'
                    value='Completed'
                    onClick={changeStatus.bind(this, task._id, "Completed")}
                    className='text-nowrap'>
                    Completed
                  </Button>
                </DropdownItem>
                <DropdownItem key='pending' value='pending'  >
                  <Button
                    isLink
                    color='danger'
                    icon='Circle'
                    value='Pending'
                    onClick={changeStatus.bind(this, task._id, "Pending")}
                    className='text-nowrap'>
                    Pending
                  </Button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </td>
          <td>
            <Link to={`../${demoPages.Tasks.subMenu.editTasks.path}/${task._id}`}>
              <Button
                isOutline={!darkModeStatus}
                color='dark'
                isLight={darkModeStatus}
                className={classNames('text-nowrap', {
                  'border-light': !darkModeStatus,
                })}
                icon='Edit'>
                Edit
              </Button>
            </Link>


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




  const searchTasks = (e) => {
    console.log("reaching");
    axios.get(`${BASE_URL}/api/tasks`).then((res) => {


      let search = e.target.value;
      let taskData = res.data;

      var taskResult = _.filter(taskData, function (obj) {
        return (
          obj.taskTitle.indexOf(search) !== -1
        );
      });

      setTasks(taskResult);
    });
  };

  const searchByJobsite = (e) => {
    e.preventDefault();
    console.log("filter by", e.target.value);
    setFilteredValue(e.target.value);
    axios
      .get(`${BASE_URL}/api/tasks`)
      .then((res) => {
        let jobsiteId = e.target.value;

        if (jobsiteId == "All") {
          setTasks(res.data);
        } else {
          let materials = res.data;

          let filterMaterial = _.filter(materials, ['jobsite', jobsiteId]);
          setTasks(filterMaterial);

          _.map(jobsites, (jobsite) => {
            if (jobsite._id == jobsiteId) {
              console.log(jobsite.address);
              setFilteredValue(jobsite.address);
              setJobsite(jobsiteId);
            }

          });
        }

      });
  }


  let listJobsites = [];
  listJobsites.push({
    label: "All",
    value: "All"
  });

  _.map(jobsites, (jobsite) => {
    let jobsiteObject = {
      label: jobsite.address,
      value: jobsite._id,
    };

    listJobsites.push(jobsiteObject);
  });


  console.log("Jobsotes list", listJobsites);


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
              onChange={searchTasks}
              autoComplete='off'
            />
          </div>
        </SubHeaderLeft>
        <SubHeaderRight>
          {filteredJobsite && (
            <CommonFilterTag title='Jobsite' text={filteredJobsite} />
          )}
          <SubheaderSeparator />
          <Dropdown >
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
                      <Label htmlFor='statusFilter'> Jobsite </Label>
                      <Select
                        id='statusFilter'
                        ariaLabel='status'
                        placeholder='Jobsite'
                        onChange={value => {

                          searchByJobsite(value);
                        }}
                        list={listJobsites}

                      />
                    </FormGroup>
                  </div>


                </form>
              </div>
            </DropdownMenu>
          </Dropdown>



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
