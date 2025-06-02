import {getConnection, getCount, getDataSource} from "./index"
import {Seller} from "./entities"

const TABLE_NAME = "NR_seller"

export const getSellerCount = getCount(TABLE_NAME);

export async function getCoords(): Promise<Seller[]> {
	const dataSource = await getDataSource()
	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize()
		}
		const sellerRepository = dataSource.getRepository(Seller)
		const sellers = await sellerRepository.find({
			select: {id: true, coord: true}, 
		})
		return sellers
	} catch (error) {
		console.error('Error fetching sellers :', error)
		throw error
	}finally {
		await dataSource.destroy()
	}
}

export async function getCoordsNear(x: number, y: number, r: number) {
	const dataSource = await getDataSource()
	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize()
		}
		const sellerRepository = dataSource.getRepository(Seller)
		const sellers = await sellerRepository
			.createQueryBuilder('seller')
			.select(['seller.id', 'seller.coord'])
			.where(
				`ST_Distance(seller.coord, ST_GeomFromText(:point, 5179)) <= :radius `,
				{
					point: `POINT(${x} ${y})`,
					radius: r
				}
			).getMany();

		console.log(r)
		return sellers
	} catch (error) {
		console.error('Error fetching sellers :', error)
		throw error
	}finally {
		await dataSource.destroy()
	}
}