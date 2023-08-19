'use client'
import { useForm } from 'react-hook-form'
// import { GetCurrencies } from './components/GetCurrencies'
import { api } from '@/lib/axios'
import { use } from 'react'
import { ArrowLeftRight } from 'lucide-react'

interface IFormInputs {
    convertTo: {amount: number, currencyCode: any}
    convertFrom: {amount: number, currencyCode: any}
}
interface ICurrenciesSymbols {
    description: string
    code: string
}

interface ICurrenciesSymbolsResponse {
    symbols: ICurrenciesSymbols[]
}

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

        }
    })

    const currencies: ICurrenciesSymbolsResponse = await data.json()
    const currenciesSymbols = Object.entries(currencies.symbols).map(([key, value]) => value);

    console.log(currenciesSymbols)

    return currenciesSymbols
}

const currenciesSymbols = getCurrencies()

export default function Home() {
    const { register, setValue, handleSubmit } = useForm<IFormInputs>({
        defaultValues: { convertFrom: {amount: 0, currencyCode: null}, convertTo: {amount: 0, currencyCode: null} },
    })
    // const field1 = watch('convertTo')
    // const field2 = watch('convertFrom')
    // const [currencies, setCurrencies] = useState<ICurrencies[]>([])
    // console.log(watchFields)
    // const convertedValue = watchFields * 1
    // const subscription = watch(value)
    // console.log(watchFields)
    // let data = use(getCurrencies())

    console.log('oi')

    // const getCurrencies = async () => {
    //     const response = await api.get('/currencies', {
    //         params: {
    //             apikey: 'P24ngfzWvm30bpz37oFi08afTbOCy2ZbiqDM1Mcs',
    //         },
    //     })

    //     console.log(response.data.data)
    //     const a = [response.data.data]
    //     const b = a.map((item) => {
    //         return {
    //             // test: item[],
    //         }
    //     })
    //     console.log(b)
    //     setCurrencies(a)
        // console.log(a.)
    

    // useEffect(() => {
    //     getCurrencies()
    // }, [])

    // useEffect(() => {
    //     // console.log(watchFields)
    //     if (field2) {
    //         setValue('convertTo', 5 / field2)
    //     }
    //     if (field1) {
    //         setValue("convertFrom", 5 * field1);
    //     }
    // }, [field1, field2])
    // setValue('convertFrom', 222)
    const currSymbols = use(currenciesSymbols)

    const onSubmit = (data: IFormInputs) => {
        console.log(data)
        // console.log(currSymbols)

        setValue('convertFrom', 300)
    }

    // console.log(response);
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
            <div className="bg-gray-50 h-[80vh] w-full max-w-3xl rounded-md border-indigo-200 border drop-shadow-md flex flex-col items-center py-8 px-8">
                <div>
                    <h1 className='text-1xl font-bold text-sky-700'>Currency Converter</h1>
                    <form
                        className="flex flex-row gap-3 items-center mt-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div>
                            <label className="rounded-md border-2 border-green-500/30 flex justify-start p-2 focus-within:border-green-700">
                                <input
                                    type="number"
                                    className="p-1 bg-transparent border-r-[1px] border-sky-600 max-w-[7rem] focus:outline-none"
                                    {...register('convertFrom.amount')}
                                />
                                <select {...register('convertFrom.currency')}  className="truncate ml-1 flex-1 px-1 bg-transparent focus:outline-none border border-transparent focus-within:border-green-500 rounded max-w-[120px] text-sm">
                                    {currSymbols?.map((currency) => (
                                        <option {...register('convertFrom.currency')} value={currency.code} key={currency.code} title={currency.description} className="text-xs">
                                            {currency.code} - {currency.description}
                                        </option>
                                    ))}
                                </select>
                                

                                {/* <GetCurrencies /> */}
                            </label>
                        </div>
                        <ArrowLeftRight className='w-6 h-6 text-emerald-700'/>
                        <div>
                            <label className="rounded-md border-2 border-green-500/30 flex justify-start p-2 focus-within:border-green-700">
                                <input
                                    type="number"
                                    className="p-1 bg-transparent border-r-[1px] border-sky-600 max-w-[7rem] focus:outline-none"
                                    {...register('convertTo.amount')}
                                />
                                <select {...register('convertTo.currency')} className="ml-1 flex-1 px-1 bg-transparent focus:outline-none border border-transparent focus-within:border-green-500 rounded max-w-[120px] text-sm">
                                    {currSymbols?.map((currency) => (
                                        <option value={currency.code} key={currency.code} title={currency.description} className="text-xs">
                                            {currency.code} - {currency.description}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <button type='submit' className="hidden">Submit</button>
                    </form>
                </div>
            </div>
        </main>
    )
}
