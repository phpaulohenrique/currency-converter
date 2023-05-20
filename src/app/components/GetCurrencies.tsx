// import { api } from '@/lib/axios'

// interface ICurrencies {
//     code: string
//     symbol: string
// }

// export async function GetCurrencies() {
//     const { data } = await api.get<ICurrencies[]>('/currencies', {
//         params: {
//             apikey: 'P24ngfzWvm30bpz37oFi08afTbOCy2ZbiqDM1Mcs',
//         },
//     })

//     console.log(data)
//     // const currencies = response.data

//     return (
//         <select className="ml-2 flex-1 px-2 bg-transparent focus:outline-none border border-transparent focus-within:border-violet-500 rounded">
//             <option value="1">RS</option>
//             <option value="2">USD</option>
//             {data.map((currency) => (
//                 <option value={currency.code} key={currency.code}>
//                     {currency.symbol}
//                 </option>
//             ))}
//         </select>

//         // <div>oi</div>
//     )
// }
