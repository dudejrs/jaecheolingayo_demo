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

export async function getCoordsNear(x: number, y: number, r: number, tags?: number[]) {
	const dataSource = await getDataSource()
	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize()
		}
		const sellerRepository = dataSource.getRepository(Seller)
		const query = sellerRepository
			.createQueryBuilder('seller')
			.select(['seller.id', 'seller.coord'])

		if (tags && tags.length > 0) {
			query
				.leftJoin('seller.tags', 'tag')
				.where(
					`ST_Distance(seller.coord, ST_GeomFromText(:point, 5179)) <= :radius `,
					{
						point: `POINT(${x} ${y})`,
						radius: r
					}
				);
			query.andWhere('tag.id IN (:...tagIds)', {tagIds: tags});

		} else {
			query
				.where(
					`ST_Distance(seller.coord, ST_GeomFromText(:point, 5179)) <= :radius `,
					{
						point: `POINT(${x} ${y})`,
						radius: r
					}
				);
		}

		const sellers = await query.getMany();
		return sellers
	} catch (error) {
		console.error('Error fetching sellers :', error)
		throw error
	}finally {
		await dataSource.destroy()
	}
}