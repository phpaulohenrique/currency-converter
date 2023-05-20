'use client'
import { ArrowsLeftRight } from '@phosphor-icons/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { GetCurrencies } from './components/GetCurrencies'
import { api } from '@/lib/axios'

interface IFormInputs {
    convertToWhichCurrency: number
    convertedCurrency: number
}
interface ICurrencies {
    code: string
    symbol: string
}

interface ICurrenciesResponse {
    data: {
        data: ICurrencies[]
    }
}

export default function Home() {
    const { register, watch, setValue, handleSubmit } = useForm<IFormInputs>({
        defaultValues: { convertedCurrency: 0, convertToWhichCurrency: 0 },
    })
    const field1 = watch('convertToWhichCurrency')
    const field2 = watch('convertedCurrency')
    const [currencies, setCurrencies] = useState<ICurrencies[]>([])
    // console.log(watchFields)
    // const convertedValue = watchFields * 1
    // const subscription = watch(value)
    // console.log(watchFields)

    const getCurrencies = async () => {
        const response = await api.get('/currencies', {
            params: {
                apikey: 'P24ngfzWvm30bpz37oFi08afTbOCy2ZbiqDM1Mcs',
            },
        })

        console.log(response.data.data)
        const a = [response.data.data]
        const b = a.map((item) => {
            return {
                test: item[],
            }
        })
        console.log(b)
        setCurrencies(a)
        // console.log(a.)
    }

    useEffect(() => {
        getCurrencies()
    }, [])

    // useEffect(() => {
    //     // console.log(watchFields)
    //     if (field2) {
    //         setValue('convertToWhichCurrency', 5 / field2)
    //     }
    //     if (field1) {
    //         setValue("convertedCurrency", 5 * field1);
    //     }
    // }, [field1, field2])
    // setValue('convertedCurrency', 222)

    const onSubmit = (data: IFormInputs) => console.log(data)

    // console.log(response);
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
            <div className="bg-gray-50 h-[80vh] w-full max-w-3xl rounded-md border-indigo-200 border drop-shadow-md flex flex-col items-center py-8 px-8">
                <div>
                    <h1>Conversor de moedas</h1>
                    <form
                        className="flex flex-row gap-4 items-center mt-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div>
                            <label className="rounded-md border-2 border-violet-300 flex justify-start p-2 focus-within:border-violet-800">
                                <input
                                    type="number"
                                    className="p-1 bg-transparent border-r-[1px] border-purple-600 max-w-[10rem] focus:outline-none"
                                    {...register('convertToWhichCurrency')}
                                />
                                <select className="ml-2 flex-1 px-2 bg-transparent focus:outline-none border border-transparent focus-within:border-violet-500 rounded">
                                    {currencies?.map((currency) => (
                                        <option value={currency.code} key={currency.symbol}>
                                            {currency.symbol}
                                        </option>
                                    ))}
                                </select>
                                {/* @ts-expect-error */}

                                {/* <GetCurrencies /> */}
                            </label>
                        </div>
                        {/* <Image
                            src="https://flagcdn.com/w20/za.png"
                            alt=""
                            width={30}
                            height={30}
                        /> */}
                        {/* <ArrowsLeftRight
                            size={26}
                            color="#030303"
                            weight="thin"
                        /> */}
                        <div>
                            <label className="rounded-md border-2 border-violet-300 flex justify-start p-2 focus-within:border-violet-800">
                                <input
                                    type="number"
                                    className="p-1 bg-transparent border-r-[1px] border-purple-600 max-w-[10rem] focus:outline-none"
                                    {...register('convertedCurrency')}
                                />
                                <select className="ml-2 flex-1 px-2 bg-transparent focus:outline-none border border-transparent focus-within:border-violet-500 rounded">
                                    <option value="1">USD</option>
                                    <option value="2">RS</option>
                                </select>
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
