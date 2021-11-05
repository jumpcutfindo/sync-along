import RedisConnection from "../../connections/RedisConnection";
const redisClient = RedisConnection.getConnection();

type User = {
  id: string;
  username: string;
  room: string;
}
export const getCurrentUser = async (id: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    redisClient.get(`USER:${id}`, (err, reply) => {
      if (err) {
        reject(err);
      }
      try {
        const user = JSON.parse(reply);
        console.log(user)
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  });
};
