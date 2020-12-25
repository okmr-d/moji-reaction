import Head from 'next/head'
import { useForm } from "react-hook-form";

import Header from '../components/Header'


export default function Home() {

  const { register, handleSubmit, errors } = useForm()

  const onSubmit = ({ text, font }) => {
    console.log({ text, font })
  }

  return (
    <div>
      <Head>
        <title>サイト名</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="max-w-2xl mx-auto">
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>

            <div>
              <div><label htmlFor="text">テキスト</label></div>
              <div>
                <textarea name="text" placeholder="" ref={register({ required: true })} />
              </div>
            </div>

            <div>
              <div><label>フォント</label></div>
              <div>
                <div>
                  <label>
                    <input name="font" type="radio" value="font1" ref={register({ required: true })} />
                    font1
                  </label>
                </div>
                <div>
                  <label>
                    <input name="font" type="radio" value="font2" ref={register({ required: true })} />
                    font2
                  </label>
                </div>
              </div>
            </div>

            <div>
              <input type="submit" />
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
