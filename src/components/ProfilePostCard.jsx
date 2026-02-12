import React from 'react'

function ProfilePostCard({article}) {

    if(!article) return;
    

  return (
    <div className='border box-border px-4 py-2 hover:bg-gray-200 rounded-lg m-2   -bg-conic-120 shadow-inner   border-gray-300  max-w-[80%] sm:max-w-1/3'>
       <div className=''>
        <p className='font-bold pt-2  px-2'>{article.title}</p>
        <p className='text-sm px-2 text-wrap  max-h-60 overflow-y-clip'>{article.body}</p>
       </div>
    </div>
  )
}

export default ProfilePostCard