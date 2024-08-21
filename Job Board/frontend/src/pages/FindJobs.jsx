import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { apiRequest,updateURL } from "../utils";

import Header from "../components/Header";
import { experience, jobTypes, jobs } from "../utils/data";
import { CustomButton, JobCard, ListBox } from "../components";

const FindJobs = () => {
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  // const [filterJobTypes, setFilterJobTypes] = useState([]);
  // const [filterExp, setFilterExp] = useState([]);
  // const [expVal,setexpVal] = useState([]);

  const [isFetching, setIsFetching] = useState(false);
  

  const navigate = useNavigate();

  const fetchJobs = async() => {
    setIsFetching(true);


    const newURL = updateURL({
      pageNum : page,
      query : searchQuery,
      // cmploc : cmpLocation,
      sort : sort,
      navigate : navigate,
      location : location,
      // jtype : filterJobTypes,
      // exp : filterExp,
      

    });

   
    try{
      const res = await apiRequest({
        url : "/jobs" + newURL,
        method : "GET",
      });

      setNumPage(res?.numOfPage);
      setRecordCount(res?.totalJobs);
      setData(res?.data);

      
      setIsFetching(false);
      console.log(res);

    }catch(error){
      console.log(error);
     
    }

  };

  // useEffect(()=>{
  //   if(expVal.length > 0){
  //     let newExpVal = [];

  //     expVal?.map((el) => {
  //       const newEl = el?.split("-");
  //       newExpVal.push(Number(newEl[0],Number(newEl[1])))
  //     });

  //     newExpVal?.sort((a,b) => a - b );

  //     setFilterExp(`${newExpVal[0]}-${newExpVal[newExpVal?.length]}`)
  //   }
   
  // },[expVal]);

  useEffect(()=>{
    fetchJobs();
  },[sort,page]);
  


  // const filterJobs = (val) => {
  //   if (filterJobTypes?.includes(val)) {
  //     setFilterJobTypes(filterJobTypes.filter((el) => el != val));
  //   } else {
  //     setFilterJobTypes([...filterJobTypes, val]);
  //   }
  // };

  // const filterExperience = async (e) => {

  //   if (expVal?.includes(e)) {
  //     setexpVal(expVal?.filter((el) => el != e));
  //   } else {
  //     setFilterJobTypes([...expVal, e]);
  //   }

  // };
  const handleSearchSubmit = async(e) => {
    e.preventDefault()

    await fetchJobs();
  };

  return (
    <div>
      <Header
        title='Land Your Dream Job with JobBoard: Your Path to Success Starts Here!'
        type='home'
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className='container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-indigo-100'>

        <div className=''>
          <div className='flex items-center justify-between mb-4'>
          <p className='text-sm md:text-base'>
              Shwoing: <span className='font-semibold'>{recordCount}</span> Jobs
              Available
            </p>

            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base'>Sort By:</p>

              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className="w-full flex flex-wrap gap-4">

            {data?.map((job, index) => {
              const newJob = {
                name: job?.company?.name,
                logo: job?.company?.profileUrl,
                ...job,
              };

              return(
          
              <JobCard job={newJob} key={index} />
            )})}
          </div>

          {numPage > page && !isFetching && (
            <div className='w-full flex items-center justify-center pt-16'>
              <CustomButton
                title='Load More'
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;

