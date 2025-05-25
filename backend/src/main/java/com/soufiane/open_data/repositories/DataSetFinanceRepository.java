package com.soufiane.open_data.repositories;

import com.soufiane.open_data.entities.DataSetFinance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DataSetFinanceRepository extends JpaRepository<DataSetFinance, Long> {
    List<DataSetFinance> findByGidAndDeletedFalse(Long gid);

}
