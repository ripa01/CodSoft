import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import CustomButton from "./CustomButton";


const SearchInput = ({ placeholder, icon, value, setValue, styles }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue("");

  return (
    <div className={`flex w-full md:w-1/3 items-center ${styles}`}>
      {icon}

      <input
        value={value}
        onChange={(e) => handleChange(e)}
        type='text'
        className='w-full md:w-64 p-2 outline-none bg-transparent text-base'
        placeholder={placeholder}
      />

     
    </div>
  );
};

const Header = ({
  title,
  type,
  handleClick,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className='bg-indigo-100'>
      <div
        className={`container mx-auto px-5 ${
          type ? "h-[400px]" : "h-[250px]"
        } flex items-center relative`}
      >
        <div className='w-full z-10'>
          <div className='mb-8'>
            <p className='text-slate-700 font-bold text-4xl'>{title}</p>
          </div>

          <div className='w-full flex items-center justify-center bg-indigo-50 px-2 md:px-5 py-2.5 md:py-6 shadow-2xl rounded-full'>
            <SearchInput
              placeholder='Job Title or Keywords'
              icon={<AiOutlineSearch className='text-gray-600 text-xl' />}
              value={searchQuery}
              setValue={setSearchQuery}
            />
          

            <div>
              <CustomButton
                onClick={handleClick}
                title='Search'
                containerStyles={
                  "text-white py-2 md:py3 px-3 md:px-10 focus:outline-none bg-indigo-600 rounded-full md:rounded-md text-sm md:text-base"
                }
              />
            </div>
          </div>

  
        </div>

      </div>
    </div>
  );
};

export default Header;
