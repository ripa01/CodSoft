import { useEffect, useState, Fragment } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { jobs } from "../utils/data";
import { CustomButton, TextInput } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Dialog, Transition, TransitionChild, DialogPanel,DialogTitle } from "@headlessui/react";
import { apiRequest } from "../utils";


const UserForm = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user?.user },
  });
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState("");
  const [uploadCv, setUploadCv] = useState("");

  const onSubmit = async (data) => {};

  const closeModal = () => setOpen(false);

  return (
    <>
      <Transition appear show={open ?? false} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </TransitionChild>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <TransitionChild
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-indigo-100 p-6 text-left align-middle shadow-xl transition-all'>
                  <DialogTitle
                    as='h3'
                    className='text-lg font-semibold flex justify-center leading-6 text-indigo-900'
                  >
                   Application Form
                  </DialogTitle>
                  <form
                    className='w-full mt-2 flex flex-col gap-5'
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className='w-full flex gap-2'>
                      <div className='w-1/2'>
                        <TextInput
                          name='firstName'
                          label='First Name'
                          placeholder='e.g. Ripa'
                          type='text'
                          register={register("firstName", {
                            required: "First Name is required",
                          })}
                          error={
                            errors.firstName ? errors.firstName?.message : ""
                          }
                        />
                      </div>
                      <div className='w-1/2'>
                        <TextInput
                          name='lastName'
                          label='Last Name'
                          placeholder='e.g. Biswas'
                          type='text'
                          register={register("lastName", {
                            required: "Last Name is required",
                          })}
                          error={
                            errors.lastName ? errors.lastName?.message : ""
                          }
                        />
                      </div>
                    </div>

                    <div className='w-full flex gap-2'>
                      <div className='w-1/2'>
                        <TextInput
                          name='contact'
                          label='Contact'
                          placeholder='Phone Number'
                          type='text'
                          register={register("contact", {
                            required: "Contact is required!",
                          })}
                          error={errors.contact ? errors.contact?.message : ""}
                        />
                      </div>

                      <div className='w-1/2'>
                        <TextInput
                          name='location'
                          label='Location'
                          placeholder='e.g. Dhaka'
                          type='text'
                          register={register("location", {
                            required: "Location is required",
                          })}
                          error={
                            errors.location ? errors.location?.message : ""
                          }
                        />
                      </div>
                    </div>

                    
                    
                      <div className='w-full'>
                        <label className='text-gray-600 text-sm mb-1'>
                          Upload Resume
                        </label>
                        </div>
                        <div className='w-full'>
                        <input
                          type='file'
                          onChange={(e) => setUploadCv(e.target.files[0])}
                        />
                      </div>

                    <div className='mt-4'>
                      <CustomButton
                        type='submit'
                        containerStyles='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                        title={"Submit"}
                      />
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const JobDetail = () => {
  const { id } = useParams();

  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const [job, setJob] = useState(null);
  const [similarJobs,setSimilarJobs] = useState([]);
  const [selected, setSelected] = useState("0");
  const [isFetching, setIsFetching] = useState(false);

  const handleDeletePost = async () => {
    setIsFetching(true);
    try {
      if (window.confirm("Are you sure you want to delete the job post?")) {
        const res = await apiRequest({
          url: "/jobs/delete-job/" + job?._id,
          method: "DELETE",
          token: user?.token,
        });
  
        if (res?.success) {
          alert(res?.message);
          window.location.replace("/");
        } else {
          alert("Failed to delete the job post.");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };
  

  const getJobDetails = async() =>
  {
    setIsFetching(true);

    try{
      const res = await apiRequest({
        url : "/jobs/get-job-detail/" + id,
        method : "GET",
      });

      
      setJob(res?.data);
      setSimilarJobs(res?.similarJobs);
      setIsFetching(false);
      console.log(res);


    }catch(error){
      setIsFetching(false);
      console.log(error);
    }

  };
 

  useEffect(() => {
    id && getJobDetails();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  return (
    <div className='container mx-auto'>
      <div className='w-full flex flex-col md:flex-row gap-10'>
        <div className='w-full h-fit mt-11 rounded-lg md:w-full 2xl:2/4 bg-indigo-50 px-5 py-10 md:px-10 shadow-md'>
          <div className='w-full flex items-center justify-between'>
            <div className='w-full flex gap-2'>
              <img
                src={job?.company?.profileUrl}
                alt={job?.company?.name}
                className='w-20 h-20 md:w-24 md:h-20 rounded'
              />

              <div className='flex flex-col'>
                <p className='text-xl font-semibold text-black'>
                  {job?.jobTitle}
                </p>
                <span className='text-base'>{job?.location}</span>

                <span className='text-base text-indigo-600'>
                  {job?.company?.name}
                </span>

                <span className='text-gray-500 text-sm'>
                  {moment(job?.createdAt).fromNow()}
                </span>
              </div>
            </div>

          </div>

          <div className='w-full flex flex-wrap md:flex-row gap-2 items-center justify-between mt-9'>
            <div className=' w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
              <span className='text-sm'>Salary</span>
              <p className='text-lg font-semibold text-indigo-700'>
                 {job?.salary} TK.
              </p>
            </div>

            <div className='w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
              <span className='text-sm'>Job Type</span>
              <p className='text-lg font-semibold text-indigo-700'>
                {job?.jobType}
              </p>
            </div>

            <div className='w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
              <span className='text-sm'>No. of Applicants</span>
              <p className='text-lg font-semibold text-indigo-700'>
                {job?.applicants?.length || 0}
              </p>
            </div>

            <div className='w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
              <span className='text-sm'>No. of Vacancies</span>
              <p className='text-lg font-semibold text-indigo-700'>
                {job?.vacancies}
              </p>
            </div>
          </div>

          <div className='w-1/2 flex gap-4 py-5'>
            <CustomButton
              onClick={() => setSelected("0")}
              title='Job Description'
              containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${
                selected === "0"
                  ? "bg-indigo-900 text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            />

            <CustomButton
              onClick={() => setSelected("1")}
              title='Company'
              containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
                selected === "1"
                  ? "bg-indigo-900 text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            />
          </div>

          <div className='my-6'>
            {selected === "0" ? (
              <>
                <p className='text-xl font-semibold text-indigo-600'>Job Decsription</p>

                <span className='text-base'>{job?.detail[0]?.desc}</span>

                {job?.detail[0]?.requirements && (
                  <>
                    <p className='text-xl font-semibold text-indigo-600 mt-8'>Requirement</p>
                    <span className='text-base'>
                      {job?.detail[0]?.requirements}
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                <div className='mb-6 flex flex-col'>
                  <p className='text-xl text-indigo-600 font-semibold'>
                    {job?.company?.name}
                  </p>
                  <span className='text-base'>{job?.company?.location}</span>
                  <span className='text-sm'>{job?.company?.email}</span>
                </div>

                <p className='text-xl font-semibold text-indigo-600'>About Company</p>
                <span>{job?.company?.about}</span>
              </>
            )}
          </div>

          <div className='w-1/4 '>
           {user?._id === job?.company?._id ? (<CustomButton
              title='Delete Post'
              onClick={handleDeletePost}
              containerStyles={`w-full flex items-center justify-center text-white bg-indigo-900 py-3 px-5 outline-none rounded-full text-base`}
            />) : (
              <CustomButton
              title='Apply Now'
              onClick={() => setOpen(true)}
              containerStyles={`w-full flex items-center justify-center text-white bg-indigo-900 py-3 px-5 outline-none rounded-full text-base`}
            />

            )}
          </div>
        </div>
      </div>
      <UserForm open={open} setOpen={setOpen} />
    </div>
  );
};

export default JobDetail;
