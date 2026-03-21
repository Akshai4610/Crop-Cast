import { useEffect, useState, useCallback } from "react";

import { getUsers } from "../../services/api";

import AdminNavbar from "../../components/admin/navbar/AdminNavbar";

import UserStatsCards from "../../components/admin/users/UserStatsCards";
import UserCharts from "../../components/admin/users/UserCharts";
import UserTable from "../../components/admin/users/UserTable";
import UserActivityTimeline from "../../components/admin/users/UserActivityTimeline";
import UserSearchBar from "../../components/admin/users/UserSearchBar";

export default function UserManagementPage() {

  const [users,setUsers] = useState([])
  const [page,setPage] = useState(1)
  const [search,setSearch] = useState("")
  const [sort,setSort] = useState("az")
  const [total,setTotal] = useState(0)

  const loadUsers = useCallback(async()=>{

    try{

      const data = await getUsers(page,search,sort)

      setUsers(data.users || [])
      setTotal(data.total || 0)

    }catch(err){
      console.error("User load failed")
    }

  },[page,search,sort])

  useEffect(()=>{
    loadUsers()
  },[loadUsers])

  return(

    <div className="min-h-screen bg-gray-950 text-white">

      <AdminNavbar/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <UserStatsCards users={users}/>

        <UserCharts users={users}/>

        <UserSearchBar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        <div className="grid xl:grid-cols-3 gap-8">

          <div className="xl:col-span-2 glass-card p-6">

            <UserTable
              users={users}
              page={page}
              setPage={setPage}
              total={total}
              refresh={loadUsers}
            />

          </div>

          <div className="glass-card p-6">

            <UserActivityTimeline users={users}/>

          </div>

        </div>

      </div>

    </div>
  )
}