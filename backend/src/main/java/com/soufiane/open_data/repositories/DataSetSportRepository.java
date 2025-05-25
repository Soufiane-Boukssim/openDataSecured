package com.soufiane.open_data.repositories;

import com.soufiane.open_data.entities.DataSetSport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DataSetSportRepository extends JpaRepository<DataSetSport, Long> {
    List<DataSetSport> findByGidAndDeletedFalse(Long gid);
}
