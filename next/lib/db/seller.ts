import {In} from "typeorm"
import {getConnection, getCount, getDataSource} from "./index"
import {Seller} from "./entities"

const TABLE_NAME = "NR_seller"

export const getSellerCount = getCount(TABLE_NAME);

function toKoreanDate(date: Date) {
	return date.toLocaleDateString('ko-KR', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
}

function refineSeller(seller : Seller) {

	return {
		...seller,
		registration_date : toKoreanDate(seller.registration_date),
		last_sale_deadline_date : toKoreanDate(seller.last_sale_deadline_date),
		tags : seller.tags.map(({name}) => name)
	}
}

function refineSellers(sellers : Seller[]) {
	return sellers.map(refineSeller)
}

export async function getSellers(take: number, skip: number, tagId? : number, keyword?: string) {
	const dataSource = await getDataSource()
	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize()
		}
		const sellerRepository = dataSource.getRepository(Seller)
		const query = sellerRepository.createQueryBuilder('seller')
			.leftJoinAndSelect('seller.tags', 'tag')
			.take(take)
			.skip(skip)

		if (tagId) {
			query.andWhere('tag.id = :tagId', {tagId})
		}

		if (keyword) {
			query.andWhere('seller.business_name LIKE :keyword', {
				keyword : `%${keyword}%`
			})
		}

		const [sellers, totalCount] = await query.getManyAndCount();
		return {
			sellers : refineSellers(sellers),
			totalCount 
		}
	} catch(error) {
		console.error('Error fetching sellers: ', error);
		throw error
	}finally {
		await dataSource.destroy();
	}
} 

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

export async function getSellersbyIds(ids: number[])  {
	const dataSource = await getDataSource();

	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize()
		}

		const sellerRepository = dataSource.getRepository(Seller);

		const sellers = await sellerRepository.find({
			where: {
		      id: In(ids),
		    },
		})

		return sellers;

	} catch(error) {
		console.error("Error fetching sellers: ", error);
		throw error
	
	} finally {
		await dataSource.destroy();
	}
}

