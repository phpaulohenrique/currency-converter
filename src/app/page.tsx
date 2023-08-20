'use client'
import { useForm } from 'react-hook-form'
// import { GetCurrencies } from './components/GetCurrencies'
// import { api } from '@/lib/axios'
import { use } from 'react'
import { ArrowLeftRight, Calculator, CircleDollarSign } from 'lucide-react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { type } from 'os'
// import Image from 'next/image'
const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
})
interface IFormInputs {
    convertTo: { amount: number | null; code: string }
    convertFrom: { amount: number | null; code: string }
}
interface ICurrenciesSymbols {
    description: string
    code: string
}

interface ICurrenciesSymbolsResponse {
    symbols: ICurrenciesSymbols[]
}

const options: ApexOptions = {
    chart: {
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
        foreColor: '#14532d',
    },
    grid: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    tooltip: {
        enabled: false,
    },
    xaxis: {
        type: 'datetime',
        axisBorder: {
            color: '#C3C3C6',
        },
        axisTicks: {
            color: '#C3C3C6',
        },
        categories: [
            '2022-01-10T00:00.000Z',
            '2022-01-12T00:00.000Z',
            '2022-01-13T00:00.000Z',
            '2022-01-15T00:00.000Z',
            '2022-01-16T00:00.000Z',
            '2022-01-23T00:00.000Z',
        ],
    },
    fill: {
        opacity: 0.3,
        colors: ['#15803d', '#1e3a8a'],
        type: 'gradient',
        gradient: {
            shade: 'dark',
            opacityFrom: 0.7,
            opacityTo: 0.2,
        },
    },
}

const series = [{ name: 'series1', data: [10, 5, 20, 30, 10, 5] }]

const getCurrencies = async () => {
    const maxAgeInSeconds = 3600 * 24 // 24 h
    // const response = await api.get('/currencies', {
    //     params: {
    //         apikey: 'P24ngfzWvm30bpz37oFi08afTbOCy2ZbiqDM1Mcs',
    //     },
    //     headers: {
    //         'Cache-control': `max-age=${maxAgeInSeconds}`
    //     }

    // })

    const data = await fetch('https://api.exchangerate.host/symbols', {
        method: 'GET',
        next: { revalidate: maxAgeInSeconds },

        headers: {
            // 'access_key': 'a27fe82aaaf2f0988d27c893bbfc22f8',
            // 'cache': 'force-cache'
        },
    })

    const currencies: ICurrenciesSymbolsResponse = await data.json()
    const currenciesSymbols = Object.entries(currencies.symbols).map(([key, value]) => value)

    // console.log(currenciesSymbols)

    return currenciesSymbols
}

const currenciesSymbols = getCurrencies()

export default function Home() {
    const { register, setValue, handleSubmit, getValues, watch } = useForm<IFormInputs>({
        defaultValues: {
            convertFrom: { amount: 1, code: 'USD' },
            convertTo: { amount: null, code: 'BRL' },
        },
    })

    const b = watch('convertFrom')

    const currSymbols = use(currenciesSymbols)

    const InvertCurrencyType = () => {
        // console.log(getValues('convertFrom.code'))
        const fromCode = getValues('convertFrom.code')
        const toCode = getValues('convertTo.code')

        setValue('convertFrom.code', toCode)
        setValue('convertTo.code', fromCode)
        setValue('convertTo.amount', null)
    }

    const onSubmit = async (data: IFormInputs) => {
        console.log(data)
        const currencyFrom = data.convertFrom
        const currencyTo = data.convertTo
        console.log(currSymbols)
        const response = await fetch(
            `https://api.exchangerate.host/convert?from=${currencyFrom.code}&to=${currencyTo.code}&amount=${currencyFrom.amount}`
        )
        const datares = await response.json()
        // console.log(datares.result)
        // setCurrentCurrencyAmount(() => 4.97)
        setValue('convertTo.amount', datares.result.toFixed(2))

        // console.log(touchedFields.convertFrom)
        // console.log(touchedFields.convertTo)
        // console.log(dirtyFields)
        console.log(b)

        // if (touchedFields.convertFrom) {
        //     setValue('convertTo.amount', 4.97)
        // } else if (touchedFields.convertTo) {
        //     setValue('convertFrom.amount', 10)
        // }
    }

    // console.log(response);
    return (
        <main className="grid grid-cols-[2fr_1fr] bg-green-100/60 font-sans h-screen">
            <div className="bg-gray-50 w-full border-yellow-400/50 border-r drop-shadow-2xl flex flex-col items-center py-8 px-8 ">
                <div>
                    <form
                        className="flex flex-col items-center justify-center"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-row gap-3 justify-start mt-14">
                            <div>
                                <label className="rounded-md border-2 border-green-500/30 flex justify-start p-2 focus-within:border-green-600">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="p-1 bg-transparent border-r-[1px] border-sky-600 max-w-[7rem] focus:outline-none"
                                        {...register('convertFrom.amount')}
                                    />
                                    <select
                                        {...register('convertFrom.code')}
                                        defaultValue="USD"
                                        className="truncate ml-1 flex-1 px-1 bg-transparent focus:outline-none border border-transparent focus-within:border-green-600 rounded max-w-[120px] text-sm"
                                    >
                                        {currSymbols?.map((currency) => (
                                            <option
                                                value={currency.code}
                                                key={currency.code}
                                                title={currency.description}
                                                className="text-xs"
                                            >
                                                {currency.code} - {currency.description}
                                            </option>
                                        ))}
                                    </select>

                                    {/* <GetCurrencies /> */}
                                </label>
                            </div>
                            <button
                                title="Invert the currency type"
                                className="py-1 px-2 bg-green-200 rounded-md border border-green-400 hover:bg-green-300 group group-hover:transition-colors self-center "
                                type="button"
                                onClick={InvertCurrencyType}
                            >
                                <ArrowLeftRight className="w-6 h-6 text-green-600 group-hover:text-green-700" />
                            </button>
                            <div className="flex flex-row gap-2">
                                <label className="rounded-md border-2 border-green-500/30 flex justify-start p-2 focus-within:border-green-700">
                                    <input
                                        type="number"
                                        step="0.01"
                                        disabled
                                        className="p-1 bg-transparent  border-sky-600 max-w-[7rem] focus:outline-none text-green-950  disabled:bg-gray-200 rounded hover:cursor-not-allowed"
                                        {...register('convertTo.amount')}
                                    />
                                    <select
                                        {...register('convertTo.code')}
                                        className="ml-1 flex-1 px-1 bg-transparent focus:outline-none border border-transparent focus-within:border-green-500 rounded max-w-[120px] text-sm"
                                    >
                                        {currSymbols?.map((currency) => (
                                            <option
                                                value={currency.code}
                                                key={currency.code}
                                                title={currency.description}
                                                className="text-xs"
                                            >
                                                {currency.code} - {currency.description}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="self-start mt-6 bg-green-100 rounded-md border border-green-400 hover:bg-green-300 text-emerald-8000 px-4 py-1 flex gap-1 items-center text-green-950"
                        >
                            <Calculator className="w-5 h-5 text-green-600" />
                            Convert
                        </button>
                    </form>

                    <div className="bg-gray-100 h-80 mt-8">
                        <Chart options={options} series={series} type="area" height="200px" />
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center mt-12">
                <div className="flex text-center gap-1">
                    <CircleDollarSign className="w-11 h-11 text-amber-400 bg-amber-100 rounded-full " />
                    <h1 className="text-4xl font-bold font-serif text-green-700 ">BR Converter</h1>
                </div>
                {/* <Image src="/money.jpg" alt="" width={300} height={300} /> */}
            </div>
        </main>
    )
}
