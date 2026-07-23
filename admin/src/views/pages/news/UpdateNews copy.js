import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import setting from '../../../setting.json'

import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CCardHeader,
  CFormCheck,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import secureLocalStorage from 'react-secure-storage'
import { useParams } from 'react-router-dom'
import EditorJSComponent from '../../../../../../igistrategy/admin/src/components/EditorJSComponent'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  slug: yup.string().required('Slug is required'),
  subtitle: yup.string().required('Subtitle is required'),
  videoType: yup.string().required('Video source is required'),
  type: yup.string().required('Video source is required'),
})

const categoriesList = [
  { id: 1, name: 'Politics' },
  { id: 2, name: 'Sport' },
  { id: 3, name: 'Entertainment' },
]

const UpdateNews = () => {
  const [slugEdited, setSlugEdited] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [newsList, setNewsList] = useState([])
  const { id } = useParams()

  const [categoriesList, setCategoryList] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      subtitle: '',
      categories: [],
      videoType: '',
      type: '',
      youtubeUrl: '',
      videoFile: null,
      thumbnail: null,
    },
  })

  const formDataValues = watch()

  const getAllCategory = async () => {
    await fetch(setting.api + '/api/categories/getAllCategory', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
      },
    })
      .then((response) => response.json())
      .then((u) => {
        if (u.status == false) {
          secureLocalStorage.clear()
          navigate('/login')
        } else {
          setCategoryList(u.data)
          console.log(u.data)
        }
      })
  }

  useEffect(() => {
    getAllCategory()
  }, [])

  useEffect(() => {
    if (formDataValues.title && !slugEdited) {
      const generatedSlug = formDataValues.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      setValue('slug', generatedSlug)
    }
  }, [formDataValues.title, slugEdited, setValue])

  const toggleCategory = (id) => {
    const alreadySelected = formDataValues.categories.includes(id)
    const newCategories = alreadySelected
      ? formDataValues.categories.filter((c) => c !== id)
      : [...formDataValues.categories, id]
    setValue('categories', newCategories)
  }

 const fetchNews = async () => {
  try {
    const token = JSON.parse(secureLocalStorage.getItem('logininfo')).token

    const res = await fetch(setting.api + '/api/news/getAllNews', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })

    const data = await res.json()
    const allNews = data.news || []
    setNewsList(allNews)

    // ✅ FIXED HERE
    const selected = allNews.find((n) => String(n._id) === String(id))

    if (selected) {
      setEditingNews(selected)

      reset({
        title: selected.title || '',
        slug: selected.slug || '',
        subtitle: selected.sub_title || '',
        type: String(selected.type || ''),
        videoType: String(selected.video_type || ''),
        youtubeUrl: selected.youtube_url || '',
        categories: selected.categories
          ? selected.categories.map((c) => c._id)
          : [],
        videoFile: null,
        thumbnail: null,
      })
    }
  } catch (error) {
    console.error('Error fetching news:', error)
  }
}

  useEffect(() => {
    fetchNews()
  }, [])

  const saveNews = async (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('sub_title', data.subtitle)
    formData.append('video_type', data.videoType)
    formData.append('type', data.type)

    data.categories.forEach((id) => {
      formData.append('categories[]', id)
    })

    if (data.videoType === '1') {
      formData.append('youtube_url', data.youtubeUrl)
    } else if (data.videoType === '2') {
      // if (data.videoFile?.[0]) formData.append('uploade_video', data.videoFile[0])
      formData.append('content', JSON.stringify(content)) // ✔ backend expects JSON

      if (data.thumbnail?.[0]) formData.append('thumbnail', data.thumbnail[0])
    }

    let endpoint = '/api/news/saveNews'

    if (editingNews) {
      endpoint = '/api/news/updateNews'
      formData.append('id', editingNews._id)
    }

    try {
      const res = await fetch(setting.api + endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
        },
      })

      const result = await res.json()
      console.log('News API response:', result)

      if (result.status) {
        alert(editingNews ? 'News updated!' : 'News created!')

        reset({
          title: '',
          slug: '',
          subtitle: '',
          categories: [],
          videoType: '',
          type: '',
          youtubeUrl: '',
          thumbnail: null,
        })
        setEditingNews(null)
      } else {
        alert(result.message || 'Failed to save news')
      }
    } catch (error) {
      console.error('Error saving news:', error)
    }
  }

  //   const saveNews = async (data) => {
  //     const formData = new FormData()
  //     formData.append('title', data.title)
  //     formData.append('sub_title', data.subtitle)
  //     formData.append('video_type', data.videoType)
  //     formData.append('type', data.type)

  //     data.categories.forEach((id) => {
  //       formData.append('categories[]', id)
  //     })

  //     if (data.videoType === '1') {
  //       formData.append('youtube_url', data.youtubeUrl)
  //     } else if (data.videoType === '2') {
  //       if (data.videoFile?.[0]) formData.append('uploade_video', data.videoFile[0])
  //       if (data.thumbnail?.[0]) formData.append('featured_img', data.thumbnail[0])
  //     }

  //     let endpoint = '/api/news/updateNews'
  //     formData.append('id', id)

  //     try {
  //       const res = await fetch(setting.api + endpoint, {
  //         method: 'POST',
  //         body: formData,
  //         headers: {
  //           Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
  //         },
  //       })

  //       const result = await res.json()
  //       console.log('News API response:', result)

  //       if (result.status) {
  //         alert(editingNews ? 'News updated!' : 'News created!')
  //         fetchNews()
  //         reset()
  //         setEditingNews(null)
  //       } else {
  //         alert(result.message || 'Failed to save news')
  //       }
  //     } catch (error) {
  //       console.error('Error saving news:', error)
  //     }
  //   }

  return (
    <div className="d-flex flex-column flex-lg-row gap-4">
      <CCol lg={7}>
        <CCard className="shadow border-0 rounded-4">
          <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
            <h5 className="mb-0">{editingNews ? 'Update News' : 'Upload Video News'}</h5>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit(saveNews)}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormInput
                    type="text"
                    label="Title"
                    placeholder="Enter Title"
                    {...register('title')}
                    onChange={(e) => {
                      setValue('title', e.target.value)
                      setSlugEdited(false)
                    }}
                  />
                  {errors.title && <small className="text-danger">{errors.title.message}</small>}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Slug"
                    placeholder="Auto Generate"
                    {...register('slug')}
                    onChange={(e) => {
                      setValue('slug', e.target.value)
                      setSlugEdited(true)
                    }}
                  />
                  {errors.slug && <small className="text-danger">{errors.slug.message}</small>}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Subtitle"
                    placeholder="Enter SubTitle"
                    {...register('subtitle')}
                  />
                  {errors.subtitle && (
                    <small className="text-danger">{errors.subtitle.message}</small>
                  )}
                </CCol>
              </CRow>
              <CRow>
                <CCol md={12}>
                  <p className="mb-2 fw-bold">Select Categories</p>
                  <CDropdown>
                    <CDropdownToggle color="secondary">
                      {formDataValues.categories.length > 0
                        ? categoriesList
                            .filter((cat) => formDataValues.categories.includes(cat.id))
                            .map((cat) => cat.name)
                            .join(', ')
                        : 'Select Categories'}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {categoriesList.map((cat) => {
                        const isSelected = formDataValues.categories.includes(cat.id)
                        return (
                          <CDropdownItem key={cat.id}>
                            <CFormCheck
                              id={`cat-${cat.id}`}
                              label={cat.name}
                              checked={isSelected}
                              onChange={() => toggleCategory(cat.id)}
                            />
                          </CDropdownItem>
                        )
                      })}
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
              </CRow>

              <CRow className="mb-3 mt-2">
                <CCol md={6}>
                  <CFormSelect
                    label="Type"
                    {...register('type')}
                    value={formDataValues.type}
                    onChange={(e) => setValue('type', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="1">Published</option>
                    <option value="2">Draft</option>
                  </CFormSelect>
                  {errors.type && <small className="text-danger">{errors.type.message}</small>}
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    label="Video Source"
                    {...register('videoType')}
                    value={formDataValues.videoType}
                    onChange={(e) => setValue('videoType', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="1">YouTube</option>
                    <option value="2">Text</option>
                  </CFormSelect>
                  {errors.videoType && (
                    <small className="text-danger">{errors.videoType.message}</small>
                  )}
                </CCol>
              </CRow>

              {formDataValues.videoType === '1' && (
                <CFormInput
                  type="url"
                  label="YouTube URL"
                  {...register('youtubeUrl')}
                  placeholder="https://youtube.com/..."
                />
              )}

              {formDataValues.videoType === '2' && (
                <>
                  <CCol md={12} className="mb-2">
                    {formDataValues.videoType === '2' && (
                      <>
                        <div
                          style={{
                            width: '100%',
                            height: '250px',
                            margin: '0 auto',

                            padding: '10px',
                            borderRadius: '8px',
                            overflowY: 'auto',
                          }}
                        >
                          <label className="fw-semibold mb-2">Description</label>
                          <EditorJSComponent data={content} onChange={setContent} />
                        </div>

                        <CCol md={12} className="mb-3">
                          <CFormInput
                            type="file"
                            label="Thumbnail"
                            accept="image/*"
                            {...register('thumbnail')}
                          />
                        </CCol>
                      </>
                    )}
                  </CCol>
                </>
              )}

              <div className="d-flex justify-content-end mt-4">
                <CButton color="primary" type="submit">
                  {editingNews ? 'Update' : 'Publish'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol lg={5}>
        <CCard className="shadow border-0 rounded-4 text-dark">
          <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
            <h5 className="mb-0">Live Preview</h5>
          </CCardHeader>
          <CCardBody>
            {formDataValues.title && (
              <p>
                <strong>Title:</strong> {formDataValues.title}
              </p>
            )}
            {formDataValues.categories?.length > 0 && (
              <p>
                <strong>Categories:</strong>{' '}
                {categoriesList
                  .filter((cat) => formDataValues.categories.includes(cat.id))
                  .map((cat) => cat.name)
                  .join(', ')}
              </p>
            )}

            {formDataValues.videoType === '1' &&
              formDataValues.youtubeUrl &&
              (() => {
                const videoId = getYouTubeId(formDataValues.youtubeUrl)
                return videoId ? (
                  <iframe
                    width="100%"
                    height="250"
                    className="rounded mb-3"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube Preview"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <p className="text-danger">Invalid YouTube URL</p>
                )
              })()}

            {formDataValues.videoType === '2' && formDataValues.videoFile?.[0] && (
              <video width="100%" height="auto" className="rounded" controls>
                <source src={URL.createObjectURL(formDataValues.videoFile[0])} />
              </video>
            )}

            {formDataValues.videoType === 'self' && formDataValues.thumbnail?.[0] && (
              <div className="mt-3">
                <strong>Thumbnail:</strong>
                <img
                  src={URL.createObjectURL(formDataValues.thumbnail[0])}
                  alt="Thumbnail"
                  className="img-fluid rounded mt-2"
                  style={{ maxHeight: '150px', objectFit: 'cover' }}
                />
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </div>
  )
}

export default UpdateNews
