import bcrypt from "bcryptjs";

export const createHash = async (
	plainText: string,
	saltRounds = 12,
): Promise<string> => {
	const salt = await bcrypt.genSalt(saltRounds);

	return bcrypt.hash(plainText, salt);
};

export const compareHash = (
	plainText: string,
	hashedText: string,
): Promise<boolean> => {
	return bcrypt.compare(plainText, hashedText);
};
