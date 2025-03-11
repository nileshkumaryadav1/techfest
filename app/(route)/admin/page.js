import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
        <Link href={'/admin/events'}>Events</Link>
    </div>
  )
}

export default page