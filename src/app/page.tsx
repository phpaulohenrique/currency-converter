'use client'
import { useForm } from 'react-hook-form'
import { use, useState } from 'react'
import { ArrowLeftRight, Calculator } from 'lucide-react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { generateDates } from '../utils/generateDates'
import Image from 'next/image'
const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
})
interface IFormInputs {
    convertFrom: { amount: number; code: string }
    convertTo: { amount: number | null; code: string }
}
interface ICurrenciesSymbols {
    description: string
    code: string
}

interface ICurrenciesSymbolsResponse {
    symbols: ICurrenciesSymbols[]
}

interface IGetConversion {
    currencyFrom: { code: string; amount: number }
    currencyTo: { code: string }
}

interface ICurrencyRatesHistoryResponse {
    rates: {
        [date: string]: {
            [currency: string]: number
        }
    }
}

const generatedDates = generateDates()
console.log(generatedDates)

const apexChartsOptions: ApexOptions = {
    chart: {
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
        foreColor: '#16a34a',
    },
    grid: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    tooltip: {
        enabled: true,
    },
    xaxis: {
        type: 'datetime',
        axisBorder: {
            color: '#475569',
        },
        axisTicks: {
            color: '#475569',
        },

        categories: generatedDates.dates,
    },
    fill: {
        opacity: 0.3,
        // colors: ['#0284c7'],
        type: 'gradient',
        gradient: {
            shade: 'dark',
            opacityFrom: 0.8,
            opacityTo: 0.2,
        },
    },
}

const getCurrenciesSymbols = async () => {
    const maxAgeInSeconds = 3600 * 24 // 24 h

    const data = await fetch('https://api.exchangerate.host/symbols', {
        next: { revalidate: maxAgeInSeconds },
    })

    const currencies: ICurrenciesSymbolsResponse = await data.json()
    const currenciesSymbols = Object.entries(currencies.symbols).map(([key, value]) => value)

    return currenciesSymbols
}

const currenciesSymbols = getCurrenciesSymbols()

export default function Home() {
    const { register, setValue, handleSubmit, getValues } = useForm<IFormInputs>({
        defaultValues: {
            convertFrom: { amount: 1, code: 'USD' },
            convertTo: { amount: null, code: 'BRL' },
        },
    })

    const [currencyHistory, setCurrencyHistory] = useState<number[]>([])
    const chartValues = [{ name: 'Conversion value', data: currencyHistory }]
    const currSymbols = use(currenciesSymbols)

    const getCurrencyHistoric = async (base: string, symbol: string) => {
        const response = await fetch(
            `https://api.exchangerate.host/timeseries?start_date=${generatedDates.fromDate}&end_date=${generatedDates.toDate}&base=${base}&symbols=${symbol}`
        )
        const data: ICurrencyRatesHistoryResponse = await response.json()

        const currencyHistory = Object.entries(data.rates).map(([key, value]) => value)
        const currencyHistoryFormatted = currencyHistory
            .map((obj) => obj[symbol])
            .map((value) => Number(value.toFixed(2)))
        setCurrencyHistory(currencyHistoryFormatted)
        // series['data'] = [...currencyHistoryFormatted]
        console.log(currencyHistoryFormatted)
    }

    const getConversion = async ({ currencyFrom, currencyTo }: IGetConversion) => {
        const response = await fetch(
            `https://api.exchangerate.host/convert?from=${currencyFrom.code}&to=${currencyTo.code}&amount=${currencyFrom.amount}`
        )
        const data = await response.json()
        return data.result.toFixed(2)
    }

    const invertCurrencyType = () => {
        const fromCode = getValues('convertFrom.code')
        const toCode = getValues('convertTo.code')

        setValue('convertFrom.code', toCode)
        setValue('convertTo.code', fromCode)
        setValue('convertTo.amount', null)
    }

    const onSubmit = async (data: IFormInputs) => {
        const currencyFrom = data.convertFrom
        const currencyTo = data.convertTo

        if (!currencyFrom.amount) {
            return alert('Fill the field amount to the conversion.')
        }

        try {
            const result = await getConversion({ currencyFrom, currencyTo })
            setValue('convertTo.amount', result)
            // console.log(generateDates())
            getCurrencyHistoric(currencyFrom.code, currencyTo.code)
        } catch {
            alert('Ops... something went wrong. Please, Try again later.')
        }
    }

    return (
        <>
            <header className="bg-gray-100 fixed px-4 md:px-10 py-3 top-0 left-0 w-full shadow-md shadow-gray-300">
                <Image src="/logo.svg" width={180} height={20} alt="The Currency Converter Logo" />
            </header>
            <Image
                src="line.svg"
                width={600}
                height={600}
                alt=""
                className="absolute right-0 bottom-0 "
            />

            <main className="bg-gray-100/30 font-sans h-screen pt-8 md:pl-20 flex flex-col items-center md:items-start">
                <div>
                    <form
                        className="flex flex-col items-center justify-center"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-start mt-14">
                            <div>
                                <label className="rounded-md border-2 border-green-500/30 flex justify-start p-2 focus-within:border-green-600">
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="1"
                                        className="p-1 bg-transparent border-r-[1px] border-sky-600 max-w-[7rem] focus:outline-none"
                                        {...register('convertFrom.amount')}
                                    />
                                    <select
                                        {...register('convertFrom.code')}
                                        defaultValue="USD"
                                        className="truncate ml-1 flex-1 px-1 bg-transparent focus:outline-none border border-transparent focus-within:border-green-600 rounded max-w-[8rem] text-sm"
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
                            <button
                                title="Invert the currency type"
                                className="py-1 px-3 bg-green-50 rounded-md border border-green-400 hover:bg-green-300 group group-hover:transition-colors self-center "
                                type="button"
                                onClick={invertCurrencyType}
                            >
                                <ArrowLeftRight className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                            </button>
                            <div className="flex flex-row gap-2">
                                <label className="rounded-md border-2 border-green-500/30 flex justify-start p-2 focus-within:border-green-700">
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="1"
                                        disabled
                                        className="p-1 bg-transparent  border-sky-600 max-w-[7rem] focus:outline-none text-green-950  disabled:bg-gray-200 rounded hover:cursor-not-allowed"
                                        {...register('convertTo.amount')}
                                    />
                                    <select
                                        {...register('convertTo.code')}
                                        className="truncate ml-1 flex-1 px-1 bg-transparent focus:outline-none border border-transparent focus-within:border-green-500 rounded max-w-[8rem] text-sm"
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
                            className="md:self-start mt-6 md:mt-4 rounded-md bg-gradient-to-r from-sky-600 via-green-600 to-green-700 hover:brightness-110 text-white px-4 py-1 flex gap-1 items-center font-medium"
                        >
                            <Calculator className="w-5 h-5 text-white" />
                            Convert
                        </button>
                    </form>

                    {!!currencyHistory.length && (
                        <div className=" mt-10 w-full rounded-lg shadow-md bg-white p-4 border border-green-200">
                            <div className="ml-3">
                                <h2 className="text-2xl text-sky-600 ">Currency variation</h2>
                                <span className="text-sm block text-gray-600 mb-4">
                                    Last 15 days
                                </span>
                            </div>

                            <Chart
                                options={apexChartsOptions}
                                series={chartValues}
                                type="area"
                                height="280px"
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* <div className="justify-center items-center hidden md:flex">
                <div className="flex text-center gap-1">
                    <CircleDollarSign className="w-11 h-11 text-amber-400 rounded-full " />
                    <h1 className="text-3xl font-medium  text-sky-700 ">The BR Converter</h1>
                </div>
            </div> */}
        </>
    )
}
