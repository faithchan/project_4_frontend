const admin = () => {
  return (
    <div className="flex items-center justify-center mt-10 mb-20">
      <div className="grid w-6/12 md:w-5/12 lg:w-4/12">
        <div className="text-center my-20 font-header tracking-widest text-gold text-2xl">
          MANAGE ACCOUNTS
        </div>
        <div>
          <div className="grid grid-cols-1  mx-7">
            <label className="md:text-sm text-xs text-white font-body tracking-wider">
              Add to Whitelist
            </label>
            <input
              className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
              type="text"
              name="name"
            />
          </div>
          <div className="flex items-center justify-center pt-5 pb-5">
            <button className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8">
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default admin
