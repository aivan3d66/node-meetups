module.exports = function usePermissionsMiddleware(pgConnectionPool) {
    function hasPermission(permissionSlug) {
        return async (req, res, next) => {
            const user_id = req.get('user_id')

            const user = await pgConnectionPool.query(
                'SELECT * FROM users where id = $1',
                [user_id]
            )

            if (user.rows[0]?.roles.includes(permissionSlug)) {
                next()
            } else {
                next(
                    new Error(
                        `User does not have permission "${permissionSlug}"`
                    )
                )
            }
        }
    }

    return {
        hasPermission,
    }
}
