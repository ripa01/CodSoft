import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CompanyCard, CustomButton,Loading, Header, ListBox } from "../components";
import { updateURL } from "../utils";
import { apiRequest } from "../utils";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cmpLocation, setCmpLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCompany = async() => {
    setIsFetching(true);


    const newURL = updateURL({
      pageNum : page,
      query : searchQuery,
      cmploc : cmpLocation,
      sort : sort,
      navigate : navigate,
      location : location,
      

    });

   
    try{
      const res = await apiRequest({
        url : newURL,
        method : "GET",
      });

      setNumPage(res?.numOfPage);
      setRecordsCount(res?.total);
      setData(res?.data);

      
      setIsFetching(false);
      console.log(res);

      // if(res.status === "failed"){
      //   setErrMsg({ ...res });
      // }else {
      //   setErrMsg({ status : "success", message : res.message});
      //   dispatch(Login(data));
      //   localStorage.setItem("userInfo",JSON.stringify(data));
        
      //   setTimeout(() => {
      //     window.location.reload();
      //   },1500);
      // }

    }catch(error){
      console.log(error);
     
    }

  };

  const handleSearchSubmit = () => {};
  const handleShowMore = () => {};

  useEffect(()=>{
    fetchCompany();
  },[page,sort]);

  return (
    <div className='w-full'>
      <Header
        title='Find Your Dream Company with JobBoard'
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={cmpLocation}
        setLocation={setSearchQuery}
      />

      <div className='container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 md:px-0 py-6 bg-indigo-100'>
        <div className='flex items-center justify-between mb-4'>
        <p className='text-sm md:text-base'>
            Shwoing: <span className='font-semibold'>{recordsCount}</span> Companies
            Available
          </p>

          <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
            <p className='text-sm md:text-base'>Sort By:</p>

            <ListBox sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className='w-full grid grid-cols-2 gap-6'>
          {data?.map((cmp, index) => (
            <CompanyCard cmp={cmp} key={index} />
          ))}

          {isFetching && (
            <div className='mt-10'>
              <Loading />
            </div>
          )}

        </div>

        {numPage > page && !isFetching && (
          <div className='w-full flex items-center justify-center pt-16'>
            <CustomButton
              onClick={handleShowMore}
              title='Load More'
              containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
