'use client'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { createBlog } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const CreateBlog = () => {
  const [value, setValue] = useState('');
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const router = useRouter();

  const removeImg = (index) => {
    try {
      setImages((prev) => {
        return prev.filter((img, ind) => ind != index);

      })
    } catch (error) {
      console.log(error);

    }
  }

  const handleClick = async () => {
    try {
      if(!value || !title) {
        return alert('Please enter some text');
      }

      const data = await createBlog(value, images, title);
      if(data?.success) {
       return  router.push(data?.url);
      }
      alert(data.error);

    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <section className='flex flex-col items-center'>
      <h1 className='font-bold text-3xl'>Create a blog</h1>
      <div className='flex gap-4 w-full p-4'>
        <div className='flex-[3] flex flex-col gap-4'>
          <input type="text" name='title' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter a title for the blog' className='bg-gray-900 p-2 rounded-md'/>
          <ReactQuill className='h-[450px]' theme="snow" value={value} onChange={setValue} />
        </div>

        <div className='flex-[1] flex flex-col items-center gap-8'>
          <h1 className='text-xl font-semibold'>Media</h1>

          <CldUploadWidget uploadPreset="hackslash" onSuccess={(result, { widget }) => {
            // console.log(result);
            setImages((prev) => [...prev, result?.info?.secure_url]);
          }} >
            {({ open }) => {
              return (
                <button className='bg-blue-500 p-2 rounded-md text-white' onClick={() => open()}>
                  Upload Images
                </button>
              );
            }}
          </CldUploadWidget>

          <div className='flex flex-wrap gap-2 justify-between p-2 w-full'>
            {
              images.length > 0 && (
                images.map((img, index) => (
                  <div key={index} className='h-[100px] w-[150px] relative rounded-md bg-gray-400 my-2'>
                    <Image src={img} fill alt='img' className='object-cover rounded-md relative ' />
                    <div className='absolute top-1 cursor-pointer right-1 hover:scale-125 duration-500 transition-all text-white font-extrabold ' onClick={() => removeImg(index)}>X</div>
                  </div>
                ))
              )
            }
          </div>

            <button className='bg-green-500 text-white p-2 rounded-md' onClick={handleClick}>Create Blog</button>

        </div>
      </div>
    </section>
  )
}

export default CreateBlog