import {getConnection, getCount, getDataSource} from "./index"
import {Seller} from "./entities"

const TABLE_NAME = "NR_seller"

export const getSellerCount = getCount(TABLE_NAME);

export async function getCoords () {
	const dataSource = await getDataSource()
	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize()
		}
		const sellerRepository = dataSource.getRepository(Seller)
		const sellers = await sellerRepository.find({
			select: {id: true, coord: true}, 
			take: 10
		})
		return sellers
	} catch (error) {
		console.error('Error fetching sellers :', error)
		throw error
	}finally {
		await dataSource.destroy()
	}
}