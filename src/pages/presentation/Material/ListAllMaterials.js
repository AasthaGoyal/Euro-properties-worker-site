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
import EVENT_STATUS from '../../common/data/enumEventStatus';
import Input from '../../../components/bootstrap/forms/Input';
import { useFormik } from 'formik';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Select from '../../../components/bootstrap/forms/Select';
import CommonFilterTag from '../../common/CommonFilterTag';
import Moment from "react-moment";

const ListAllJobsites = () => {
  const { themeStatus, darkModeStatus } = useDarkMode();



  const [jobsitesmaterialpurchases, setJobsitesmaterialpurchases] = useState(
    []
  );
  const [jobsites, setJobsites] = useState([]);
  const [jobsite, setJobsite] = useState();
  const [modal, setModal] = useState(false);
  const [jobsitesmaterialpurchaseId, setJobsitesmaterialpurchaseId] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsitesmaterialpurchasesPerPage] = useState(10);
  const [perPage, setPerPage] = useState(PER_COUNT['5'])
  const [jobsiteList, setJobsitesList] = useState([]);
  const [filteredJobsite, setFilteredValue] = useState("All");

  React.useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/api/jobsites`).then((res) => {
      console.log("jobsites", res.data);

      setJobsites(res.data);
    });

    axios.get(`${BASE_URL}/api/jobsitesmaterialpurchases`).then((res) => {
      setJobsitesmaterialpurchases(res.data);

    });


    setLoading(false);
  }, []);

  const openModal = (id) => {
    // setJobsiteId(id)
    setModal(!modal);
    setJobsitesmaterialpurchaseId(id);
    console.log("Jobsitesmaterialpurchase:", id);
  };


  let jobsitesmaterialpurchaseTable;

  // Get current posts
  const indexOfLastJobsitesmaterialpurchase =
    currentPage * jobsitesmaterialpurchasesPerPage;
  const indexOfFirstJobsitesmaterialpurchase =
    indexOfLastJobsitesmaterialpurchase - jobsitesmaterialpurchasesPerPage;
  const currentJobsitesmaterialpurchases = jobsitesmaterialpurchases.slice(
    indexOfFirstJobsitesmaterialpurchase,
    indexOfLastJobsitesmaterialpurchase
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log("jobsitesmaterialpurchases:", currentJobsitesmaterialpurchases);

  if (currentJobsitesmaterialpurchases.length === 0) {
    jobsitesmaterialpurchaseTable = (
      <tr>
        <td colSpan="6">No records</td>
      </tr>
    );
  } else {
    jobsitesmaterialpurchaseTable = _.map(
      currentJobsitesmaterialpurchases,
      (jobsitesmaterialpurchase) => {

        console.log(jobsitesmaterialpurchase);
        let jobsite;
        let address;

        if (jobsites && jobsites.length === 0) {
          address = "";
        } else {
          jobsite = _.filter(jobsites, [
            "_id",
            jobsitesmaterialpurchase.jobsite,
          ]);

          console.log(jobsite)
          //address = "";
          address = jobsite[0] && jobsite[0].address;
        }

        return (
          <tr key={jobsitesmaterialpurchase._id}>
            <td>
              <Link to={`../${demoPages.Material.subMenu.editMaterial.path}/${jobsitesmaterialpurchase._id}`}>
                {jobsitesmaterialpurchase.materialName}
              </Link></td>
            <td>

              {address}
            </td>


            <td>{jobsitesmaterialpurchase.quantity}</td>
            <td>{jobsitesmaterialpurchase.totalCost}</td>
            <td>
              <Moment date={new Date(jobsitesmaterialpurchase.createdAt)} />
            </td>
            <td>
              <Link to={`../${demoPages.Material.subMenu.editMaterial.path}/${jobsitesmaterialpurchase._id}`}>
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
      }
    );
  }

  const searchMaterials = (e) => {
    axios.get(`${BASE_URL}/api/jobsitesmaterialpurchases`).then((res) => {


      let search = e.target.value;
      let materialData = res.data;

      var materialResult = _.filter(materialData, function (obj) {

        return (
          obj.materialName.indexOf(search) !== -1 ||
          obj.materialName.indexOf(_.capitalize(search)) !== -1 ||
          obj.materialName.indexOf(_.upperCase(search)) !== -1 ||
          obj.materialName.indexOf(_.lowerCase(search)) !== -1
        );
      });


      setJobsitesmaterialpurchases(materialResult);
    });
  };

  const searchByJobsite = (e) => {
    e.preventDefault();
    console.log("filter by", e.target.value);
    setFilteredValue(e.target.value);
    axios
      .get(`${BASE_URL}/api/jobsitesmaterialpurchases`)
      .then((res) => {
        let jobsiteId = e.target.value;

        if (jobsiteId == "All") {
          setJobsitesmaterialpurchases(res.data);
        } else {
          let materials = res.data;

          let filterMaterial = _.filter(materials, ['jobsite', jobsiteId]);
          setJobsitesmaterialpurchases(filterMaterial);

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

  let jobsitesmaterialpurchaseLoading;

  if (loading) {
    jobsitesmaterialpurchaseLoading = (
      <tr>
        <td colSpan="6">
          <h3>Loading...</h3>
        </td>
      </tr>
    );
  } else {
    jobsitesmaterialpurchaseLoading = jobsitesmaterialpurchaseTable;
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
              onChange={searchMaterials}

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
            <CardLabel icon='PaintBucket' >

              <CardTitle>Jobsite's Materials</CardTitle>

            </CardLabel>
            <CardActions>


            </CardActions>

          </CardHeader>


          <CardBody className='table-responsive' >

            <table className='table table-modern'>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Jobsite</th>

                  <th>Quantity</th>
                  <th>Total Cost</th>
                  <th>Purchased Date</th>



                  <td />

                </tr>
              </thead>
              <tbody>
                {jobsitesmaterialpurchaseLoading}
              </tbody>
            </table>




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

          </CardBody>
          <PaginationButtons
            data={jobsitesmaterialpurchases}
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


ListAllJobsites.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //
  auth: state.auth,
});

export default connect(mapStateToProps)(ListAllJobsites);
