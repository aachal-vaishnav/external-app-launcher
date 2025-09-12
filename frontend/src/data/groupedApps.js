// new
export function groupByCategory(apps) {
  const groups = {}
  apps.forEach(app => {
    if (!groups[app.category]) groups[app.category] = []
    groups[app.category].push(app)
  })
  return groups
}
